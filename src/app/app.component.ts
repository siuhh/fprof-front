import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ResponseStatus } from './services/requests.service';

//import LocomotiveScroll, { OnScrollEvent } from 'locomotive-scroll';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public ready = false;
    public loggedIn = false;
    public connectionStatus: ResponseStatus = ResponseStatus.None;

    constructor(private auth: AuthService, private router: Router) {
    }

    async ngOnInit() {
        // let scroll = new LocomotiveScroll({
        //     el: (document.querySelector('[data-scroll-container]') as HTMLElement),
        //     smooth: true
        // });
        let connection = await this.auth.connect();

        this.connectionStatus = connection;

        this.loggedIn = await this.auth.isLoggedIn();
        this.ready = true;

        if (this.connectionStatus == ResponseStatus.Unathorized) {
            this.router.navigate(['/login']);
        }
        else if (this.router.url == '/login') {
            this.router.navigate(['/']);
        }
    }

    public connectionOk() {
        return this.connectionStatus != ResponseStatus.ServerDead &&
            this.connectionStatus != ResponseStatus.Error;
    }
}
