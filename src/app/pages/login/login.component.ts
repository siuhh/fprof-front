import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Clinic } from 'src/app/models/clinic.model';
import { Doctor } from 'src/app/models/doctor.model';

import { AuthService, Role } from 'src/app/services/auth.service';
import { ResponseStatus } from 'src/app/services/requests.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    constructor(private auth: AuthService, private router: Router) { }
    public loginMethod?: 'Адміністратор' | 'Лікар';

    @Input()
    public login: string = "";
    @Input()
    public password: string = "";

    public loading: boolean = false;
    public response = 200;

    public async logIn() {
        let response;
        this.loading = true;

        if (this.loginMethod == 'Адміністратор')
            response = await this.auth.logInAsClinic(this.login, this.password);
        else
            response = await this.auth.logInAsDoctor(this.login, this.password);

        if (response.status == ResponseStatus.Success) {
            this.router.navigate(['/']).then(_ => window.location.reload());

            return;
        }

        this.response = response.errorMessage!.status;

        this.loading = false;
    }
    public getError() {
        if (this.response == 500 || this.response == 0)
            return 'Спробуйте пізніше';
        if (this.response == 401)
            return 'Хибні дані'
        return '';
    }
}

