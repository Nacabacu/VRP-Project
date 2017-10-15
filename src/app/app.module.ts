import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DriverHomeComponent } from './driver/driver-home/driver-home.component';
import { DriverComponent } from './driver/driver.component';
import { DrivingResultComponent } from './driver/driving-result/driving-result.component';
import { TodoDriverComponent } from './driver/todo-driver/todo-driver.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { ClientComponent } from './planner/client/client.component';
import { CreateClientComponent } from './planner/client/create-client/create-client.component';
import { CreateDepotComponent } from './planner/depot/create-depot/create-depot.component';
import { DepotComponent } from './planner/depot/depot.component';
import { PlannerHistoryComponent } from './planner/planner-history/planner-history.component';
import { PlannerComponent } from './planner/planner.component';
import { PlanningResultComponent } from './planner/planning-result/planning-result.component';
import { PlanningComponent } from './planner/planning/planning.component';

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
    TodoDriverComponent,
    DrivingResultComponent,
    ErrorPageComponent,
    HeaderComponent,
    PlannerHistoryComponent,
    DriverHomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  providers: [AuthGuard, AuthService],
})
export class AppModule { }
