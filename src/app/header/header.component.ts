import { Router } from '@angular/router';
import { AuthService } from './../authentication/auth.service';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy {
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
    if (this.isLoggedIn) {
      this.navigateHomeUrl = '/' + this.role;
      this.router.navigate([this.navigateHomeUrl]);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
