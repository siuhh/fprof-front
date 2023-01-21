import { Doctor } from "./doctor.model";
import { Treatment } from "./treatment.model";

export class Clinic {
    constructor(
        public name: string,
        public treatments: Array<Treatment>,
        public doctors: Array<Doctor>,
        public id?: number,
    ) {

    }
}