
import { Patient } from "./patient.model";
import { Record } from "./record.model";

export class Treatment {
    constructor(
        public admissionDate: Date,
        public mainDiagnosis: string,
        public patientId?: number,
        public patient?: Patient,
        public additionalInfo?: string,
        public dischargeDate?: Date,
        public id?: number,
        public records?: Array<Record>,
    ) {

    }
}