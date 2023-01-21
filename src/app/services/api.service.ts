import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { RequestsService, Response, ResponseStatus } from './requests.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {//same as request service but with verification
    constructor(private request: RequestsService, private auth: AuthService) {

    }

    public async get<T>(url: string): Promise<Response<T>> {
        let access = await this.auth.isLoggedIn();

        if (access = false) {
            return { status: ResponseStatus.Unathorized, entity: undefined, errorMessage: undefined }
        }

        let credentials = this.auth.getCredentials();

        return await this.request.apiGet(url, credentials.login!, credentials.password!);
    }

    public async post<T>(url: string, body?: T): Promise<Response<T>> {
        let access = await this.auth.isLoggedIn();

        if (access = false) {
            return { status: ResponseStatus.Unathorized, entity: undefined, errorMessage: undefined }
        }

        let credentials = this.auth.getCredentials();

        return await this.request.apiPost(url, credentials.login!, credentials.password!, body);
    }

    public async delete(url: string): Promise<Response<undefined>> {
        let access = await this.auth.isLoggedIn();

        if (access = false) {
            return { status: ResponseStatus.Unathorized, entity: undefined, errorMessage: undefined }
        }

        let credentials = this.auth.getCredentials();

        return await this.request.apiDelete(url, credentials.login!, credentials.password!);
    }
}
