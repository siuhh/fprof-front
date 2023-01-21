import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import "@angular/common/locales/uk";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table'
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SplitterModule } from 'primeng/splitter';
import { ChartModule } from 'primeng/chart';
import { TabPanel, TabViewModule } from 'primeng/tabview';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { NavComponent } from './components/nav/nav.component';
import { TreatmentsComponent } from './pages/treatments/treatments.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { HeaderComponent } from './components/header/header.component';
import { TreatmentComponent } from './pages/treatments/treatment/treatment.component';
import { AuthService } from './services/auth.service';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import { DoctorComponent } from './pages/doctors/doctor/doctor.component';
import { AddTreatmentComponent } from './pages/treatments/add-treatment/add-treatment.component';
import { DateukrPipe } from './pipes/dateukr.pipe';
import { ArchiveComponent } from './pages/treatments/archive/archive.component';
import { AddDoctorComponent } from './pages/doctors/add-doctor/add-doctor.component';
import { RecordComponent } from './pages/record/record.component';
import { AddRecordComponent } from './pages/record/add-record/add-record.component';
import { NodeComponent } from './components/icf-table/node/node.component';
import { IcfTableComponent } from './components/icf-table/icf-table.component';
import { RatingComponent } from './components/icf-rating/rating/rating.component';
import { IcfRatingComponent } from './components/icf-rating/icf-rating.component';
import { DatetimeukrPipe } from './pipes/datetimeukr.pipe';
import { PasswordModule } from 'primeng/password';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NavComponent,
        TreatmentsComponent,
        ErrorMessageComponent,
        HeaderComponent,
        TreatmentComponent,
        DoctorsComponent,
        DoctorComponent,
        AddTreatmentComponent,
        DateukrPipe,
        ArchiveComponent,
        AddDoctorComponent,
        RecordComponent,
        AddRecordComponent,
        NodeComponent,
        IcfTableComponent,
        RatingComponent,
        IcfRatingComponent,
        DatetimeukrPipe
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,

        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        TableModule,
        CalendarModule,
        DialogModule,
        ConfirmDialogModule,
        ScrollPanelModule,
        SplitterModule,
        ChartModule,
        TabViewModule,
        PasswordModule
    ],
    providers: [HttpClient, ConfirmationService],
    bootstrap: [AppComponent]
})
export class AppModule implements OnInit {
    constructor(private auth: AuthService) {
    }
    async ngOnInit() {
        await this.auth.connect();
    }

}
