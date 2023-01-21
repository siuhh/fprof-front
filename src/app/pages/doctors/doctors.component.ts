import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorsService } from 'src/app/services/db/doctors.service';

@Component({
    selector: 'app-doctors',
    templateUrl: './doctors.component.html',
    styleUrls: ['./doctors.component.scss']
})
export class DoctorsComponent implements OnInit {
    public doctors = new Array<Doctor>();
    public selected?: Doctor;

    constructor(private service: DoctorsService, private router: Router) { }

    async ngOnInit() {
        let res = await this.service.get();

        res.entity?.forEach(x => this.doctors.push(x));
    }
    public open(doctor: Doctor) {
        if (this.selected == doctor)
            this.router.navigate(['/doctor', { id: doctor.id }]);
        else
            this.selected = doctor;
    }

}
