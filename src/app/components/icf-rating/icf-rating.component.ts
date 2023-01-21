import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IcfAssessment } from 'src/app/models/icf.model';

@Component({
    selector: 'app-icf-assessments',
    templateUrl: './icf-rating.component.html',
    styleUrls: ['./icf-rating.component.scss']
})
export class IcfRatingComponent {
    @Input()
    public selected = new Array<IcfAssessment>;
    @Input()
    public additionalInfo = '';
    @Input()
    public assessments!: Array<IcfAssessment>
    @Input()
    public editable = false;
    @Output()
    public onRemove: EventEmitter<IcfAssessment> = new EventEmitter();
    @Output()
    public onSelect: EventEmitter<IcfAssessment> = new EventEmitter();

    public remove(assessment: IcfAssessment) {
        let assessmentIndex = this.assessments.indexOf(assessment);
        this.assessments.splice(assessmentIndex, 1);
        this.onRemove.emit(assessment);
    }
    public select(assessment: IcfAssessment) {
        if (this.selected.includes(assessment)) {
            this.selected.splice(this.selected.indexOf(assessment), 1);
            return;
        }
        this.selected?.push(assessment);
    }
}
