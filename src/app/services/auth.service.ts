import { Injectable } from '@angular/core';
import { Doctor } from '../models/doctor.model';
import { Clinic } from '../models/clinic.model';
import { RequestsService, ResponseStatus } from './requests.service';

export enum Role {
    Unauthorized = 0, Clinic = 1, Doctor = 2,
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private static doctor: Doctor | undefined = undefined;
    private static clinic: Clinic | undefined = undefined;

    private static login?: string;
    private static password?: string;
    private static role?: Role;

    constructor(private requests: RequestsService) {

    }

    public getCredentials() {
        return {
            login: AuthService.login,
            password: AuthService.password,
            role: AuthService.role
        };
    }

    public async getEntity(): Promise<Clinic | Doctor | undefined> {
        let credentials = this.getCredentials();
        switch (credentials.role) {
            case Role.Clinic:
                if (AuthService.clinic == undefined) {
                    AuthService.clinic =
                        (await this.logInAsClinic(credentials.login!, credentials.password!)).entity
                }
                return AuthService.clinic;
            case Role.Doctor:
                if (AuthService.doctor == undefined) {
                    AuthService.doctor =
                        (await this.logInAsDoctor(credentials.login!, credentials.password!)).entity;
                }
                return AuthService.doctor;
            default:
                return undefined;
        }
    }

    public async isLoggedIn(): Promise<boolean> {
        return AuthService.role != undefined && AuthService.role != Role.Unauthorized;
    }

    private saveCredentials(login: string, password: string, role: Role) {
        AuthService.login = login;
        AuthService.password = password;
        AuthService.role = role;
        localStorage.setItem('login', login);
        localStorage.setItem('password', password);
        localStorage.setItem('role', role.toString());
    }

    public async logInAsDoctor(login: string, password: string) {
        let response = await this.requests.apiGet<Doctor>("login/doctor", login, password);

        if (response.status == ResponseStatus.Success) {
            this.saveCredentials(login, password, Role.Doctor);
        }
        return response;
    }

    public async logInAsClinic(login: string, password: string) {
        let response = await this.requests.apiGet<Clinic>("login/clinic", login, password);
        if (response.status == ResponseStatus.Success) {
            this.saveCredentials(login, password, Role.Clinic);
        }
        return response;
    }

    public async connect() {
        let login = localStorage.getItem('login');
        let password = localStorage.getItem('password');

        let role = Role.Unauthorized;
        let response;
        let status: ResponseStatus;

        if (login == null || password == null) {
            status = ResponseStatus.Unathorized;
        }
        else switch (localStorage.getItem('role')) {
            case '1':
                role = Role.Clinic;
                response = (await this.logInAsClinic(login, password));

                status = response.status;

                if (status == ResponseStatus.Success) {
                    AuthService.clinic = response.entity;
                }
                break;
            case '2':
                role = Role.Doctor;
                response = (await this.logInAsDoctor(login, password));

                status = response.status;

                if (status == ResponseStatus.Success) {
                    AuthService.doctor = response.entity;
                }
                break;
            default:
                status = ResponseStatus.Unathorized;
        }
        if (status == ResponseStatus.Success) {
            AuthService.role = role;
            AuthService.login = login!;
            AuthService.password = password!;
        }
        return status;
    }


    public logOut() {
        localStorage.setItem('role', '0');

        localStorage.setItem('password', '');
        localStorage.setItem('login', '');

        AuthService.login = undefined!;
        AuthService.password = undefined!;

        AuthService.role = undefined!;
    }
}
