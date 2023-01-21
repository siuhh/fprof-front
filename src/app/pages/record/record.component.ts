import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Treatment } from 'src/app/models/treatment.model';
import { Record } from 'src/app/models/record.model';
import { TreatmentsService } from 'src/app/services/db/treatments.service';
import { IcfService } from 'src/app/services/icf.service';
import { ResponseStatus } from 'src/app/services/requests.service';
import { IcfAssessment } from 'src/app/models/icf.model';

@Component({
    selector: 'app-record',
    templateUrl: './record.component.html',
    styleUrls: ['./record.component.scss']
})
export class RecordComponent {
    public error = 200;
    public treatment!: Treatment;
    public record?: Record;
    public assessments!: Array<IcfAssessment>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public treatmentsService: TreatmentsService,
        private icfService: IcfService
    ) { }

    public async ngOnInit() {
        let response;

        this.route.paramMap.subscribe(async (params: ParamMap) => {
            let treatmentId = params.get('treatment');
            let recordId = params.get('id');

            if (treatmentId == null) {
                return;
            }

            response = await this.treatmentsService.getById(treatmentId);

            this.error = response.errorMessage?.status ?? 200;
            if (this.error != 200) {
                return;
            }
            this.treatment = response.entity!;

            //get record
            this.treatment.records!.forEach(async record => {
                if ('' + record.id! == recordId) {
                    this.record = record;
                    this.assessments = await this.icfService.initFromRecord(record);
                    return;
                }
            });

            this.error = this.record != undefined ? 200 : 404;
        });
    }

    public async remove() {
        let res = await this.treatmentsService.deleteRecord(this.treatment.id!, this.record!.id!);
        this.router.navigate(['treatment', { 'id': this.treatment.id }]);
    }
}
