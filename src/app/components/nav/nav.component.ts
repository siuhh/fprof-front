import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Role } from 'src/app/services/auth.service';


@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
    public menuExpanded = false;
    public loggedIn = false;

    constructor(private authService: AuthService, private router: Router) {
    }

    async ngOnInit() {
        this.loggedIn = await this.authService.isLoggedIn();
    }

    @HostListener('window:scroll', ['$event'])
    scrollHandler(event: Event) {
        // document.getElementById("nav")!.style.top = "" + document.body.scrollTop;
    }

    public isAdmin() {
        return this.authService.getCredentials().role == Role.Clinic;
    }

    public async logOut() {
        await this.authService.logOut();
        this.router.navigate(['/login']);
    }
}
