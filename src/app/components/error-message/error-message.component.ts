import { Component, Input } from '@angular/core';

interface Dictionary<T> {
    [Key: number]: T;
}

@Component({
    selector: 'app-error-message',
    templateUrl: './error-message.component.html',
    styleUrls: ['./error-message.component.scss']
})

export class ErrorMessageComponent {

    private messages: Dictionary<String> = {
        0: 'Проблема з підключенням до серверу',
        200: '',
        401: 'Немає доступу',
        404: 'Не знайдено',
        500: 'Спробуйте пізніше'
    }
    @Input("response-code")
    public responseCode: number = 200;

    @Input("font-size")
    public fontSize: string = "normal";

    @Input("message")
    public message: string = '';

    public getMessage() {
        if (this.message != '')
            return this.message;
        return this.messages[this.responseCode];
    }
    public getStyle() {
        return 'font-size: ' + this.fontSize + ';'
    }
}
