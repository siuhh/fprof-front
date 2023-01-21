import { Injectable } from '@angular/core';
import { IcfAssessment } from '../models/icf.model';
import { Record } from '../models/record.model';
import { DatetimeukrPipe } from '../pipes/datetimeukr.pipe';
import { IcfService } from './icf.service';

export class AssessmentDynamic {
    public code: string;
    public history = new Array<IcfAssessment>;

    constructor(code: string) {
        this.code = code;
    }
}
export class AssessmentHistorySet {
    public assessments = new Array<AssessmentDynamic>();

    public add(assessment: IcfAssessment) {
        let addNew = true;
        this.assessments.forEach(history => {
            if (history.code == assessment.code) {
                addNew = false;
                this.assessments[this.assessments.indexOf(history)].history.push(assessment);
                return;
            }
        });

        if (!addNew)
            return;

        let history = new AssessmentDynamic(assessment.code);

        history.history.push(assessment);

        this.assessments.push(history);
    }
    public last(history: AssessmentDynamic): IcfAssessment {
        let last = history.history[history.history.length - 1];

        let rating: IcfAssessment = {
            record: last.record,
            code: last.code,
            value: last.value
        };

        return rating;
    }
}
@Injectable({
    providedIn: 'root'
})
export class PatientStatusService {
    public assessmentsHistory: AssessmentHistorySet = undefined!;
    public dates = new Array<Date>();

    constructor(private icfService: IcfService) { }
    public async init(records: Array<Record>) {
        this.dates = new Array<Date>();
        let histSet = new AssessmentHistorySet();

        for (const record of records) {
            let assessments = await this.icfService.initFromRecord(record);
            this.dates.push(record.date);

            for (const assessment of assessments) {
                histSet.add(assessment);
            }
        }

        //fill missed ratings with previous results(for graphic)

        for (let i = 0; i < histSet.assessments.length; i++) {
            let j = 0;
            while (j < records.length && histSet.assessments[i].history.length < records.length) {

                if (histSet.assessments[i].history[j].record.date != records[j].date) {
                    let takeFrom = histSet.assessments[i].history[j > 0 ? j - 1 : j + 1];
                    if (takeFrom == undefined) {
                        histSet.assessments[i].history.push(new IcfAssessment(
                            histSet.assessments[i].history[j].value,
                            histSet.assessments[i].history[j].code, records[j]));
                        continue;
                    }
                    histSet.assessments[i].history.splice(j, 0, new IcfAssessment(
                        Math.floor((takeFrom.value + histSet.assessments[i].history[j].value) / 2),//mid value
                        takeFrom.code, records[j])
                    );
                }
                j += 1;
            }
        }
        this.assessmentsHistory = histSet;
    }
    public getGraphicInfo(assessments: Array<IcfAssessment>): {
        labels: string[],
        data: { set: any, label: string }[]
    } {
        let neededHistories = new Array<AssessmentDynamic>();

        for (const assessment of assessments) {
            for (const h of this.assessmentsHistory.assessments) {
                if (h.code == assessment.code)
                    neededHistories.push(h);
            };
        }
        let allData: Array<{ set: any[], label: string }> = new Array();

        for (let i = 0; i < neededHistories.length; i++) {
            const assessment = neededHistories[i];

            let label = assessment.code;

            //select assessment values
            let data = new Array<number>;

            for (const x of assessment.history) {
                data.push(x.value);
            }

            allData.push({ set: data, label: label });
        }

        //get dates
        let datepipe = new DatetimeukrPipe();

        let dates = new Array<string>();

        for (const d of this.dates) {
            dates.push(datepipe.transform(d));
        }

        return {
            labels: dates,
            data: allData
        };
    }

    public getLastRatingMentions() {
        let last = new Array<IcfAssessment>();

        this.assessmentsHistory.assessments.forEach(h => {
            last.push(this.assessmentsHistory.last(h));
        });

        return last;
    }
}
