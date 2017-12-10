import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './authentication/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  isLoggedIn;
  loggedInSubscription: Subscription;
  role;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.loggedInSubscription = this.authService.loginEmitter().subscribe((res) => {
      this.isLoggedIn = res;
      if (this.isLoggedIn) {
        this.role = this.authService.getRole();
      } else {
        this.role = '';
      }
    });
  }

  onHomeClicked() {
    this.authService.onHomeClicked();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
