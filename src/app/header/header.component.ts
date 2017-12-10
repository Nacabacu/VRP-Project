import { Router } from '@angular/router';
import { AuthService } from './../authentication/auth.service';
import { Component, OnInit, OnDestroy, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() openNav: EventEmitter<any> = new EventEmitter();

  loggedInSubscription: Subscription;
  isLoggedIn: boolean;
  role: string;
  navigateHomeUrl: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loggedInSubscription = this.authService.loginEmitter().subscribe((res) => {
      this.isLoggedIn = res;
      if (this.isLoggedIn) {
        this.role = this.authService.getRole();
      } else {
        this.role = '';
      }
    });
    this.authService.isLoggedin();
  }

  ngOnDestroy() {
    this.loggedInSubscription.unsubscribe();
  }

  onHomeClicked() {
    this.authService.onHomeClicked();
  }

  onNavResponsive() {
    this.openNav.emit(null);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
