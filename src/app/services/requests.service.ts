import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

export enum ResponseStatus {
    ServerDead = 0,
    Success = 200,
    Error = 500,
    Unathorized = 401,
    NotFound = 404,
    Loading = 600,
    None = 601
}

export interface Response<T> {
    status: ResponseStatus,
    errorMessage: HttpErrorResponse | undefined,
    entity?: T
}

@Injectable({
    providedIn: 'root'
})
export class RequestsService {
    public url: string = "https://localhost:7074/";

    public getFullUrl(url: string) {
        if (url[0] == "/") {
            url = url.substring(1, url.length);
        }
        return this.url + url;
    }

    constructor(private http: HttpClient) {

    }

    public getLogInHeaders(login: string, password: string): HttpHeaders {
        return new HttpHeaders()
            .set("Login", login)
            .set("Password", password);
    }

    public async apiGet<T>(url: string, login: string, password: string): Promise<Response<T>> {
        url = this.getFullUrl(url);

        let status: ResponseStatus = ResponseStatus.None;
        let errorMessage: HttpErrorResponse | undefined;
        let entity: T;

        let headers = this.getLogInHeaders(login, password);

        let request = this.http.get<T>(url, { headers, observe: "response" });

        await lastValueFrom(request).then(
            (response) => {
                entity = response.body!;
                status = ResponseStatus.Success;
            }).catch((error: HttpErrorResponse) => {
                errorMessage = error;
                status = errorMessage.status;
            });

        return { status: status, errorMessage: errorMessage, entity: entity! };
    }
    public async apiPost<T>(url: string, login: string, password: string, body?: T): Promise<Response<T>> {
        url = this.getFullUrl(url);

        let status: ResponseStatus = ResponseStatus.None;
        let errorMessage: HttpErrorResponse | undefined;
        let entity: T;

        let headers = this.getLogInHeaders(login, password);

        let request = this.http.post<T>(url, body, { headers, observe: "response" });

        await lastValueFrom(request).then(
            (response) => {
                entity = response.body!;
                status = ResponseStatus.Success;
            }).catch((error: HttpErrorResponse) => {
                errorMessage = error;
                status = errorMessage.status;
            });

        return { status: status, errorMessage: errorMessage, entity: entity! };
    }

    public async apiDelete(url: string, login: string, password: string): Promise<Response<undefined>> {
        url = this.getFullUrl(url);

        let status: ResponseStatus = ResponseStatus.None;
        let errorMessage: HttpErrorResponse | undefined;

        let headers = this.getLogInHeaders(login, password);

        let request = this.http.delete(url, { headers, observe: "response" });

        await lastValueFrom(request).then(
            (response) => {
                status = ResponseStatus.Success;
            }).catch((error: HttpErrorResponse) => {
                errorMessage = error;
                status = errorMessage.status;
            });

        return { status: status, errorMessage: errorMessage, entity: undefined };
    }
}
