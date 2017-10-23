import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { CdkTableModule } from '@angular/cdk/table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { GooglePlaceModule } from "angular2-google-place";

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
import { PlannerTodoComponent } from './planner/planner-todo/planner-todo.component';
import { DriverTodoComponent } from './driver/driver-todo/driver-todo.component';

import { AuthGuard } from './authentication/auth-guard.service';
import { AuthService } from './authentication/auth.service';
import { ResultService } from './services/result.service';
import { ClientService } from './services/client.service';
import { DepotService } from './services/depot.service';

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
    PlannerTodoComponent,
    DriverTodoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    NgxDatatableModule,
    GooglePlaceModule,
    AgmSnazzyInfoWindowModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCN8TC7W834nK2DfiF6mu9OhAkUFaSLHlk',
      libraries: ["places"]
    })
  ],
  providers: [
    AuthGuard,
    AuthService,
    ResultService,
    ClientService,
    DepotService
  ],

})
export class AppModule { }
