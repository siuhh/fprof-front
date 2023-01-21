import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IcfTableComponent } from 'src/app/components/icf-table/icf-table.component';
import { IcfNode, IcfAssessment } from 'src/app/models/icf.model';
import { Record } from 'src/app/models/record.model';
import { Treatment } from 'src/app/models/treatment.model';
import { TreatmentsService } from 'src/app/services/db/treatments.service';
import { IcfService } from 'src/app/services/icf.service';
import { PatientStatusService } from 'src/app/services/patient-status.service';
import { ResponseStatus } from 'src/app/services/requests.service';

@Component({
    selector: 'app-add-record',
    templateUrl: './add-record.component.html',
    styleUrls: ['./add-record.component.scss']
})
export class AddRecordComponent implements OnInit {
    @ViewChild('icfTable')
    public icfTable!: IcfTableComponent;

    public error: number = 200;
    public treatment!: Treatment;

    public title: string = '';
    public date: Date = new Date(Date.now());

    public assessments: Array<IcfAssessment> = new Array;

    public addIcfRecordPopup = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private treatmentsService: TreatmentsService,
        private icfService: IcfService,
        private patientStatus: PatientStatusService
    ) { }

    public async ngOnInit() {
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
            this.getDataFromLastRecord();

            await this.patientStatus.init(this.treatment.records!);
        });
    }

    public async getDataFromLastRecord() {
        this.assessments = await this.patientStatus.getLastRatingMentions();
        //видалити обрані записи з icf-table
        this.assessments.forEach(rating => {
            let node = new IcfNode(rating.code, true);

            this.icfTable.selectedNodes.push(node);
        });
        return;
    }

    public parseDate(dateString: string): Date {
        return new Date(dateString);
    }

    public select() {
        this.icfTable.selectedNodes.forEach(x => {
            let add = true;

            this.assessments.forEach(rating => {
                if (rating.code == x.name) {
                    add = false
                    return;
                }
            });
            if (add)
                this.assessments.push(new IcfAssessment(-1, x.name, null!));
        });
    }

    public addIcfRecord() {
        this.addIcfRecordPopup = true;
    }

    public remove(rating: IcfAssessment) {
        console.log(this.icfTable.selectedNodes);

        let nodeIndex = -1;

        for (let i = 0; i < this.icfTable.selectedNodes.length; i++) {
            const node = this.icfTable.selectedNodes[i];
            if (node.compareName(rating)) {
                nodeIndex = i;
                break;
            }
        }

        if (nodeIndex != -1)
            this.icfTable.selectedNodes.splice(nodeIndex, 1);

    }

    public async confirm() {
        this.title = this.title == '' ? "Запис №" + (this.treatment.records!.length + 1) : this.title;
        await this.treatmentsService.saveRecord(this.treatment.id!, new Record(this.date, this.title, this.icfService.toIcfString(this.assessments)));
        this.router.navigate(['treatment', { 'id': this.treatment.id }])
    }
}
