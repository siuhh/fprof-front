import { Injectable, NgModule } from '@angular/core';
import { CanActivate, Router, RouterModule, Routes } from '@angular/router';
import { AddDoctorComponent } from './pages/doctors/add-doctor/add-doctor.component';
import { DoctorComponent } from './pages/doctors/doctor/doctor.component';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import { LoginComponent } from './pages/login/login.component';
import { AddRecordComponent } from './pages/record/add-record/add-record.component';
import { RecordComponent } from './pages/record/record.component';
import { AddTreatmentComponent } from './pages/treatments/add-treatment/add-treatment.component';
import { ArchiveComponent } from './pages/treatments/archive/archive.component';
import { TreatmentComponent } from './pages/treatments/treatment/treatment.component';
import { TreatmentsComponent } from './pages/treatments/treatments.component';
import { AuthService, Role } from './services/auth.service';

const routes: Routes = [
    { path: '', component: TreatmentsComponent },
    { path: 'treatments-archive', component: ArchiveComponent },
    { path: 'add-treatment', component: AddTreatmentComponent },
    { path: 'treatment', component: TreatmentComponent },

    { path: 'record', component: RecordComponent },
    { path: 'add-record', component: AddRecordComponent },

    { path: 'doctors', component: DoctorsComponent },
    { path: 'add-doctor', component: AddDoctorComponent },
    { path: 'doctor', component: DoctorComponent },

    { path: 'login', component: LoginComponent }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }
