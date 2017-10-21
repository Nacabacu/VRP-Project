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
  loginForm: FormGroup;
  hide = true;
  errorMessage: string;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
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
