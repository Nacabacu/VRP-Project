import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AgmCoreModule } from '@agm/core';
import { CdkTableModule } from '@angular/cdk/table';
import {
  MatTableModule,
  MatPaginatorModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ClientComponent } from './planner/client/client.component';
import { CreateClientComponent } from './planner/client/create-client/create-client.component';
import { DepotComponent } from './planner/depot/depot.component';
import { CreateDepotComponent } from './planner/depot/create-depot/create-depot.component';
import { PlannerComponent } from './planner/planner.component';
import { PlannerHistoryComponent } from './planner/planner-history/planner-history.component';
import { PlanningComponent } from './planner/planning/planning.component';
import { PlanningResultComponent } from './planner/planning-result/planning-result.component';
import { DriverComponent } from './driver/driver.component';
import { DriverHomeComponent } from './driver/driver-home/driver-home.component';
import { TodoDriverComponent } from './driver/todo-driver/todo-driver.component';
import { DrivingResultComponent } from './driver/driving-result/driving-result.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';
import { ClientService } from './shared/service/client.service';

@NgModule({
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
    DriverHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    BrowserAnimationsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCN8TC7W834nK2DfiF6mu9OhAkUFaSLHlk'
    })
  ],
  providers: [AuthGuard, AuthService, ClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
