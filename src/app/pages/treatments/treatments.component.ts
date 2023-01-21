import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Treatment } from 'src/app/models/treatment.model';
import { TreatmentsService } from 'src/app/services/db/treatments.service';

@Component({
    selector: 'app-treatments',
    templateUrl: './treatments.component.html',
    styleUrls: ['./treatments.component.scss']
})
export class TreatmentsComponent implements OnInit {
    public treatments: Array<Treatment> = new Array<Treatment>();
    public selected?: Treatment;
    public filter: string = '';
    public filteredTreatments: Array<Treatment> = new Array<Treatment>();

    constructor(private treatmentsService: TreatmentsService, private router: Router) { }
    async ngOnInit() {
        await this.initArray();
        for (const t of this.treatments) {
            this.filteredTreatments.push(t);
        }
    }

    private async initArray() {
        this.treatments = new Array<Treatment>();
        let res = await this.treatmentsService.get();
        res.entity?.forEach(x => this.treatments.push(x));
    }

    public search($event: Event) {
        let val = ($event.target as HTMLInputElement).value.toLowerCase();

        this.filteredTreatments = new Array();

        for (const treatment of this.treatments) {
            if (treatment.patient?.pib.toLowerCase().includes(val) ||
                treatment.mainDiagnosis.toLowerCase().includes(val) ||
                treatment.patient?.historyNumber?.toLowerCase().includes(val)
            )
                this.filteredTreatments.push(treatment);
        }
    }

    public select(treatment: Treatment) {
        if (this.selected == treatment) {
            this.router.navigate([`/treatment`, { id: treatment.id }]);
        }
        else {
            this.selected = treatment;
        }
    }

    public async delSelected() {
        await this.treatmentsService.delete(this.selected!.id!);
        this.initArray();
    }
    public loadLazy(event: any) {

    }
}
