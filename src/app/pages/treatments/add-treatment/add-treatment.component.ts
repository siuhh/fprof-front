import { Component, Input, OnInit } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from 'src/app/models/patient.model';
import { Treatment } from 'src/app/models/treatment.model';
import { TreatmentsService } from 'src/app/services/db/treatments.service';
import { IcfService } from 'src/app/services/icf.service';

@Component({
    selector: 'app-add',
    templateUrl: './add-treatment.component.html',
    styleUrls: ['./add-treatment.component.scss']
})
export class AddTreatmentComponent implements OnInit {
    public errorMessage = '';

    public lastName: string = '';
    public firstName: string = '';
    public fathersName: string = '';
    public birthDate?: Date;
    public mainDiagnosis: string = '';
    public additionalInfo?: string = '';
    public historyNumber?: string;

    public searchResults: Array<Patient> = new Array<Patient>();
    public selectedResult?: Patient;

    constructor(
        private service: TreatmentsService,
        private router: Router) { this.search(); }

    async ngOnInit() {

    }

    private clearData() {
        if (this.firstName == '' ||
            this.lastName == '' ||
            this.fathersName == '')
            return;

        this.firstName.replace(' ', '');
        this.lastName.replace(' ', '');
        this.fathersName.replace(' ', '');

        //capitalize first letters
        this.firstName = this.firstName.charAt(0).toLocaleUpperCase() + this.firstName.slice(1);
        this.lastName = this.lastName.charAt(0).toLocaleUpperCase() + this.lastName.slice(1);
        this.fathersName = this.fathersName.charAt(0).toLocaleUpperCase() + this.fathersName.slice(1);
    }

    private checkData() {
        return this.mainDiagnosis != '' && (this.selectedResult != undefined || (this.firstName != '' &&
            this.lastName != '' &&
            this.fathersName != '' &&
            this.birthDate != null))
    }

    public async add() {
        this.clearData();

        if (!this.checkData()) {
            this.errorMessage = 'Виділені поля повинні бути заповненими';
            return;
        }
        let currentDate = new Date();

        let existingPatient = this.selectedResult != undefined;
        let patient = !existingPatient ? new Patient(
            this.lastName + " " + this.firstName + " " + this.fathersName,
            this.birthDate!,
            this.historyNumber
        ) : undefined;

        let treatment = new Treatment(
            currentDate,
            this.mainDiagnosis,
            this.selectedResult?.id,
            patient,
            this.additionalInfo,
        );
        //add treatment and get newly generated id
        let id = (await this.service.add(treatment)).entity?.id;

        this.router.navigate(['treatment', { id: id }]);
    }

    public async search() {
        if (this.firstName == '' &&
            this.lastName == '' &&
            this.fathersName == '')
            return;
        this.searchResults = new Array<Patient>();
        let res = await this.service.searchPatient(this.lastName, this.firstName, this.fathersName, this.historyNumber);

        res.entity!.forEach(x => {
            this.searchResults.push(x);
        })
    }

    public select(patient?: Patient) {
        if (patient == undefined) {
            this.selectedResult = undefined;
            return;
        }
        this.historyNumber = patient.historyNumber;
        this.selectedResult = patient;
    }

    public getDate(date: Date) {
        return date.toString().slice(0, 10);
    }
}
