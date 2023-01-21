export class Patient {
    constructor(
        public pib: string,
        public birthDate: Date,
        public historyNumber?: string,
        public id?: number,
    ) { }
}