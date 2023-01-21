import { Clinic } from "./clinic.model";

export class Doctor {
    constructor(
        public pib: string,
        public birthDate: Date,
        public clinic: Clinic,
        public speciality: string,
        public id?: number,
        public loginInfo?: {
            login: string,
            password: string
        }
    ) {

    }
}