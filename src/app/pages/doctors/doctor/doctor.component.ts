import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Doctor } from 'src/app/models/doctor.model';
import { Treatment } from 'src/app/models/treatment.model';
import { DoctorsService } from 'src/app/services/db/doctors.service';
import { TreatmentsService } from 'src/app/services/db/treatments.service';
import { ResponseStatus } from 'src/app/services/requests.service';

@Component({
    selector: 'app-doctor',
    templateUrl: './doctor.component.html',
    styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {
    public error: ResponseStatus = 200;
    public treatments = new Array<Treatment>;
    public doctor!: Doctor;
    public selected?: Treatment;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private doctorsService: DoctorsService,
        private treatmentsService: TreatmentsService,
        private confirmationService: ConfirmationService
    ) { }

    public ngOnInit(): void {
        let response;

        this.route.paramMap.subscribe(async (params: ParamMap) => {
            let id = params.get('id');
            if (id == null) {
                this.error = ResponseStatus.NotFound;
                return;
            }
            response = await this.doctorsService.getById(id);
            this.error = response.status;
            this.doctor = response.entity!;
            this.initTreatments();
        });
    }
    public async initTreatments() {

        this.treatments = new Array<Treatment>();

        (await this.doctorsService.getTreatments(this.doctor!.id!)).entity!.forEach(x => this.treatments.push(x));
    }

    public remove(event: Event) {
        this.confirmationService.confirm({
            target: event.target!,
            message: 'Ви дійсно бажаєте видалити?<br>Відновити інформацію неможливо',
            icon: '',
            acceptLabel: 'Так',
            acceptButtonStyleClass: 'p-button-danger',
            rejectLabel: 'Ні',
            accept: () => {
                this.doctorsService.delete(this.doctor.id!);
                this.router.navigate(['doctors']);
            },
            reject: () => {
                //reject action
            }
        });
    }

    public async removeAccess() {
        this.selected = undefined;
        await this.treatmentsService.removeAccess(this.selected!.id!, this.doctor!.id!);
        this.initTreatments();
    }

    public select(treatment: Treatment) {
        if (this.selected == treatment) {
            this.router.navigate([`/treatment`, { id: treatment.id }]);
        }
        else {
            this.selected = treatment;
        }
    }

}
