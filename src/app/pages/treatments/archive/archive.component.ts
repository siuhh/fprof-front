import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Treatment } from 'src/app/models/treatment.model';
import { TreatmentsService } from 'src/app/services/db/treatments.service';

@Component({
    selector: 'app-archive',
    templateUrl: './archive.component.html',
    styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
    public treatments: Array<Treatment> = new Array<Treatment>();
    public selectedId: number = -1;

    constructor(private treatmentsService: TreatmentsService, private router: Router) { }
    async ngOnInit() {
        this.initArray();
    }

    private async initArray() {
        this.treatments = new Array<Treatment>();
        let res = await this.treatmentsService.getArchive();
        res.entity?.forEach(x => this.treatments.push(x));
    }

    public select(treatment: Treatment) {
        if (this.selectedId == treatment.id) {
            this.router.navigate([`/treatment`, { id: treatment.id }]);
        }
        else {
            this.selectedId = treatment.id!;
        }
    }

}
