import { AuthService } from '../auth.service';
import { AuthGuard } from '../auth-guard.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    
  }

}

