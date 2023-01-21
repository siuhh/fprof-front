import { Injectable } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';
import { Treatment } from 'src/app/models/treatment.model';
import { ApiService } from '../api.service';
import { Record } from 'src/app/models/record.model';
import { AuthService, Role } from '../auth.service';

@Injectable({
    providedIn: 'root'
})
export class TreatmentsService {
    constructor(private api: ApiService) {

    }

    public async get() {
        return await this.api.get<Array<Treatment>>(
            "treatments/"
        );;
    }

    public async getById(id: string) {
        let result = (await this.api.get<Treatment>(`treatments/${id}`));

        //sort by records date 
        result.entity!.records!.sort((a, b) => {
            if (a.date < b.date)
                return -1;
            if (a.date > b.date)
                return 1;
            return 0;
        });
        return result;
    }

    public async delete(id: number) {
        return (await this.api.delete(`treatments/${id}`));
    }

    public async add(entity: Treatment) {
        return (await this.api.post(`treatments/`, entity));
    }

    public async searchPatient(ln?: string, frn?: string, fsn?: string, history?: string) {
        let lnq = ln != undefined && ln != '' ? `lastName=${ln}` : '';
        let fnq = frn != undefined && frn != '' ? `&firstName=${frn}` : '';
        let fsnq = fsn != undefined && fsn != '' ? `&fathersName=${fsn}` : '';
        let hnq = history != undefined ? `&historyNumber=${history}` : '';
        let str = 'patients/search?' + lnq + fnq + fsnq + hnq;

        return (await this.api.get<Array<Patient>>(str));
    }

    public async getArchive() {
        return await this.api.get<Array<Treatment>>('treatments/archive');
    }
    public async getArchiveByPatient(id: number) {
        return await this.api.get<Array<Treatment>>(`treatments/archive/${id}`);
    }

    public async grantAccess(treatment: number, doctor: number) {
        return (await this.api.post(`treatments/access?treatment=${treatment}&doctor=${doctor}`));
    }

    public async removeAccess(treatment: number, doctor: number) {
        return (await this.api.delete(`treatments/access?treatment=${treatment}&doctor=${doctor}`));
    }

    public async saveRecord(treatmentId: number, record: Record) {
        return (await this.api.post(`treatments/records?treatmentId=${treatmentId}`, record));
    }
    public async deleteRecord(treatmentId: number, recordId: number) {
        return (await this.api.delete(`treatments/records?treatmentId=${treatmentId}&recordId=${recordId}`));
    }
}
