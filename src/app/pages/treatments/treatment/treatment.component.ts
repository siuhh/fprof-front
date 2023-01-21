import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ChartComponent } from 'chart.js';
import { ConfirmationService } from 'primeng/api';
import { Dialog } from 'primeng/dialog/public_api';
import { IcfRatingComponent } from 'src/app/components/icf-rating/icf-rating.component';
import { RatingComponent } from 'src/app/components/icf-rating/rating/rating.component';
import { Doctor } from 'src/app/models/doctor.model';
import { IcfAssessment } from 'src/app/models/icf.model';
import { Record } from 'src/app/models/record.model';
import { Treatment } from 'src/app/models/treatment.model';
import { AuthService, Role } from 'src/app/services/auth.service';
import { DoctorsService } from 'src/app/services/db/doctors.service';
import { TreatmentsService } from 'src/app/services/db/treatments.service';
import { IcfService } from 'src/app/services/icf.service';
import { PatientStatusService } from 'src/app/services/patient-status.service';
import { ResponseStatus } from 'src/app/services/requests.service';

@Component({
    selector: 'app-treatment',
    templateUrl: './treatment.component.html',
    styleUrls: ['./treatment.component.scss']
})
export class TreatmentComponent implements OnInit {
    public graphOptions = {
        responsive: false,
        maintainAspectRatio: false,

        scales: {
            y: {
                min: 0,
                max: 4,
                suggestedMin: 0,
                suggestedMax: 4
            }
        }
    }
    public treatment!: Treatment;
    public error: ResponseStatus = 200;

    public additionalInfoPopup = false;

    @ViewChild('lastRecord')
    public lastRecord!: IcfRatingComponent;
    public lastRecordAssessments = new Array<IcfAssessment>;
    public lineGraphData: any = undefined;
    public barGraphData = new Array<any>;
    public graphPopup = false;

    public grantAccessPopup = false;
    public allDoctors = new Array<Doctor>();
    public doctorsWithAccess = new Array<Doctor>;
    public selectedDoctor?: Doctor;

    public archive = new Array<Treatment>;
    public selectedArchive?: Treatment;

    public role?: Role;

    constructor(
        private route: ActivatedRoute,
        private treatmentsService: TreatmentsService,
        private auth: AuthService,
        private doctorsService: DoctorsService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private patientStatus: PatientStatusService
    ) {
    }

    async ngOnInit() {
        this.role = this.auth.getCredentials().role!;

        let response;

        this.route.paramMap.subscribe(async (params: ParamMap) => {
            let id = params.get('id');

            if (id == null) {
                this.error = ResponseStatus.NotFound;
                return;
            }

            response = await this.treatmentsService.getById(id);

            this.error = response.status;
            this.treatment = response.entity!;

            this.initDoctorsWithAccess();

            if (!this.isInArchive()) {
                this.initArchive();
            }

            await this.patientStatus.init(this.treatment.records!);
            this.lastRecordAssessments = this.patientStatus.getLastRatingMentions();
        });
    }

    public async initArchive() {
        this.archive = new Array<Treatment>;
        let treats = (await this.treatmentsService.getArchiveByPatient(this.treatment.patient!.id!)).entity;
        treats?.forEach(x => {
            this.archive.push(x)
        });
    }

    private async initDoctorsWithAccess() {
        if (this.isClinic()) {
            this.doctorsWithAccess = (await this.doctorsService.getWithAccess(this.treatment.id!)).entity!;
        }
    }

    public async showGraphs() {
        const colors = [
            "#bf94e4",
            "#008080",
            "#ffc45f",
            "#660066",
            "#03c03c",
            "#fe0b04",
            "#ff0000",
            "#0000ff",
            "#fa8072",
        ];
        let data = this.patientStatus.getGraphicInfo(this.lastRecord.selected);
        let labels = data.labels;

        let lineData = new Array;
        let barData = new Array;

        let bd;

        for (let i = 0; i < data.data.length; i++) {
            const d = data.data[i];
            bd = [
                {
                    label: d.label,
                    data: d.set,
                    backgroundColor: colors[i],
                    yAxisID: 'y',
                    tension: 0.11
                }
            ];

            barData.push({
                labels: labels,
                datasets: bd
            });
            console.log(barData);

            lineData.push(
                {
                    label: d.label,
                    data: d.set,
                    fill: false,
                    borderColor: colors[i],
                    yAxisID: 'y',
                    tension: 0.11
                }
            );
            console.log(lineData);
        }
        lineData.push({
            label: ' ',
            data: [-1, 5],
            fill: false,
            borderColor: '#00000000',
            yAxisID: 'y',
            tension: 0.11
        })

        this.barGraphData = barData;

        this.lineGraphData = {
            labels: labels,
            datasets: lineData
        };

        console.log(this.lineGraphData, this.barGraphData);

        this.graphPopup = true;
    }

    public selectDoctor(doctor: Doctor) {
        if (this.selectedDoctor == doctor)
            this.router.navigate(['/doctor/', { id: doctor.id }]);
        else
            this.selectedDoctor = doctor;
    }

    public selectArchive(treatment: Treatment) {
        if (this.selectedArchive == treatment) {
            this.router.navigate([`/treatment`, { id: treatment.id }]);
        }
        else {
            this.selectedArchive = treatment;
        }
    }

    public openRecord(record: Record) {
        this.router.navigate(['/record', { "treatment": this.treatment.id, "id": record.id }]);
    }

    public async addDoctor() {
        this.grantAccessPopup = true;
        this.allDoctors = new Array<Doctor>();

        let alldocs = (await this.doctorsService.get()).entity;

        alldocs?.forEach(x => {
            if (this.doctorsWithAccess.length == 0) {
                this.allDoctors.push(x);
            }
            else {
                let add = true;

                this.doctorsWithAccess.forEach(doc => {
                    if (x.id == doc.id) {
                        add = false;
                        return;
                    }
                });

                if (add) {
                    this.allDoctors.push(x);
                }
            }
        });
    }

    public async grantAccess(doctor: Doctor) {
        await this.treatmentsService.grantAccess(this.treatment.id!, doctor.id!);
        this.initDoctorsWithAccess();
        this.grantAccessPopup = false;
    }

    public async removeAccess() {
        await this.treatmentsService.removeAccess(this.treatment.id!, this.selectedDoctor!.id!);
        this.initDoctorsWithAccess();
    }

    public discharge(event: Event) {
        this.confirmationService.confirm({
            target: event.target!,
            message: 'Ви дійсно бажаєте виписати пацієнта та перенести <br> інформацію в архів?<br>(Архівовані записи неможливо змінити)',
            icon: '',
            acceptLabel: 'Так',
            acceptButtonStyleClass: 'p-button-danger',
            rejectLabel: 'Ні',
            accept: async () => {
                await this.treatmentsService.delete(this.treatment.id!);
                this.router.navigate(['treatments-archive']);
            },
            reject: () => {
                //reject action
            }
        });
    }

    public isInArchive() {
        return this.treatment.dischargeDate != undefined;
    }

    public isClinic() {
        return this.role != undefined && this.role == Role.Clinic;
    }
}
