import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Clinic } from 'src/app/models/clinic.model';
import { Doctor } from 'src/app/models/doctor.model';
import { AuthService, Role } from 'src/app/services/auth.service';

interface Dictionary<T> {
    [Key: string]: T;
}

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public element!: HTMLElement;
    public clinicName: string = '';
    public doctorName: string = '';
    public role: string = '';

    @Input('page-name')
    public title: string = '';

    constructor(private authService: AuthService, private router: Router, private titleService: Title) {
    }

    async ngOnInit() {
        this.element = document.getElementById("header")!;
        setTimeout(() => {

        }, 1);

        this.role = this.getRole();
        await this.initName();

        this.titleService.setTitle("FProf(" + this.clinicName + ") - " + this.title);

    }

    public async isLoggined() {
        return await this.authService.isLoggedIn();
    }

    public async initName() {
        let entity = await this.authService.getEntity();

        let role = this.getRole();

        if (role == "Адміністратор") {
            this.clinicName = (entity as Clinic).name;
            return;
        }
        this.clinicName = (entity as Doctor).clinic.name;
        this.doctorName = (entity as Doctor).pib;
    }

    public getRole(): string {
        let role = this.authService.getCredentials().role;
        if (role == Role.Clinic) {
            return "Адміністратор"
        }

        return "Лікар"
    }
    top() {
        return '' + document.body.scrollTop;
    }
}
