import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IcfAssessment } from 'src/app/models/icf.model';

@Component({
    selector: 'app-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
    @Input()
    public selected = false;
    @Input()
    public assesment?: IcfAssessment;
    @Input()
    public ratable = true;

    @Output()
    rate: EventEmitter<number> = new EventEmitter<number>();

    @Output()
    select: EventEmitter<number> = new EventEmitter<number>();

    constructor() { }

    ngOnInit(): void {
    }

}
