import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateukr'
})
export class DateukrPipe implements PipeTransform {
    private monthsNames = [
        "Січень",
        "Лютий",
        "Березень",
        "Квітень",
        "Травень",
        "Червень",
        "Липень",
        "Серпень",
        "Вересень",
        "Жовтень",
        "Листопад",
        "Грудень",
    ]
    transform(date: Date): string {
        let value = new Date(date);
        let month = this.monthsNames[value.getMonth()];

        return `${month} ${value.getDate()}, ${value.getFullYear()}`;
    }
}
