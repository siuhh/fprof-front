import { Injectable } from '@angular/core';
import { Doctor } from 'src/app/models/doctor.model';
import { Treatment } from 'src/app/models/treatment.model';
import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class DoctorsService {
    constructor(private api: ApiService) {

    }

    public async get() {
        return await this.api.get<Array<Doctor>>(
            "doctors/"
        );;
    }

    public async getById(id: string) {
        return (await this.api.get<Doctor>(`doctors/${id}`));
    }

    public async getWithAccess(treatmentId: number) {
        return (await this.api.get<Array<Doctor>>(`doctors/withAccess/${treatmentId}`));
    }

    public async delete(id: number) {
        this.api.delete(`doctors/${id}`);
    }

    public async getTreatments(id: number) {
        return (await this.api.get<Array<Treatment>>(`doctors/${id}/treatments`));
    }

    public async register(doctor: Doctor) {
        return (await this.api.post<Doctor>(`doctors`, doctor));
    }
}
