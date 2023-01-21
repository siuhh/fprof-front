import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorsService } from 'src/app/services/db/doctors.service';

@Component({
    selector: 'app-add-doctor',
    templateUrl: './add-doctor.component.html',
    styleUrls: ['./add-doctor.component.scss']
})
export class AddDoctorComponent {
    public credentialsPopup = false;
    public errorMessage: string = '';
    public loginErrorMessage: string = '';

    public lastName: string = '';
    public firstName: string = '';
    public fathersName: string = '';
    public birthDate?: Date;
    public speciality: string = '';

    public login: string = '';
    public password: string = '';

    constructor(private doctorsService: DoctorsService, private router: Router) {

    }

    public clearData() {
        this.firstName.replace(' ', '');
        this.lastName.replace(' ', '');
        this.fathersName.replace(' ', '');

        //capitalize first letters
        this.firstName = this.firstName.charAt(0).toLocaleUpperCase() + this.firstName.slice(1);
        this.lastName = this.lastName.charAt(0).toLocaleUpperCase() + this.lastName.slice(1);
        this.fathersName = this.fathersName.charAt(0).toLocaleUpperCase() + this.fathersName.slice(1);
    }

    public validate() {
        return this.lastName != '' &&
            this.firstName != '' &&
            this.fathersName != '' &&
            this.birthDate != undefined &&
            this.speciality != '';
    }

    public setCredentials() {
        this.clearData();
        if (this.validate())
            this.credentialsPopup = true;
        else
            this.errorMessage = 'Виділені поля повинні бути заповненими'
    }

    public async confirm() {
        this.credentialsPopup = false;

        let doc = new Doctor(
            this.lastName + " " + this.firstName + " " + this.fathersName,
            this.birthDate!,
            undefined!,
            this.speciality,
            undefined,
            {
                login: this.login,
                password: this.password
            }
        );

        let res = await this.doctorsService.register(doc);

        this.router.navigate(['/doctors']);
    }
}
