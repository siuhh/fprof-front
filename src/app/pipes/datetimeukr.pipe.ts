import { Pipe, PipeTransform } from '@angular/core';
import { DateukrPipe } from './dateukr.pipe';

@Pipe({
    name: 'datetimeukr'
})
export class DatetimeukrPipe implements PipeTransform {

    transform(date: Date): string {
        let value = new Date(date);
        let dateukr = new DateukrPipe();

        let hour: string = (value.getHours() / 10 >= 1 ? '' : '0') + value.getHours();
        let minutes: string = (value.getMinutes() / 10 >= 1 ? '' : '0') + value.getMinutes();

        return `${dateukr.transform(date)}, ${hour}:${minutes}`;
    }

}
