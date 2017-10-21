import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuard } from '../authentication/auth-guard.service';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loggedInSubscription: Subscription;
  isLoggedIn: boolean;
  loginForm: FormGroup;
  showPassword = true;
  errorMessage: string;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.loggedInSubscription = this.authService.loginEmitter().subscribe((res) => {
      this.isLoggedIn = res;
      if (this.isLoggedIn) {
        const url = '/' + this.authService.getRole();
        this.router.navigate([url]);
      }
    });
    this.authService.isLoggedin();
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  onLogin() {
    this.authService.isAuthenticated(this.loginForm.value.username, this.loginForm.value.password).then((res) => {
      if (res === 'planner') {
        this.router.navigate(['/planner']);
      } else {
        this.router.navigate(['/driver']);
      }
    }).catch((err) => {
      if (err) {
        this.errorMessage = 'username or password is incorrect';
      }
    });
  }

  getErrorMessage() {
    if (this.loginForm.get('username').hasError('required') || this.loginForm.get('password').hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }

}
