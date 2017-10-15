import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';

import { DriverComponent } from './driver/driver.component';
import { DrivingResultComponent } from './driver/driving-result/driving-result.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { ClientComponent } from './planner/client/client.component';
import { CreateClientComponent } from './planner/client/create-client/create-client.component';
import { CreateDepotComponent } from './planner/depot/create-depot/create-depot.component';
import { DepotComponent } from './planner/depot/depot.component';
import { PlannerComponent } from './planner/planner.component';
import { PlanningResultComponent } from './planner/planning-result/planning-result.component';
import { PlanningComponent } from './planner/planning/planning.component';
import { AccountService } from './services/account.service';

import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    LoginComponent,
    ClientComponent,
    DepotComponent,
    DriverComponent,
    PlannerComponent,
    PlanningComponent,
    PlanningResultComponent,
    CreateClientComponent,
    CreateDepotComponent,
    DrivingResultComponent,
    ErrorPageComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    AccountService
  ],
})
export class AppModule { }
