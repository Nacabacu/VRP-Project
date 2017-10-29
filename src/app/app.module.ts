import { DriverService } from './services/driver.service';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes } from '@angular/router';

import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AgmCoreModule } from '@agm/core';

import { MyDateAdapter } from './myDateAdapter';
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
import { DeleteDialogComponent } from './shared/delete-dialog/delete-dialog.component';

import { AuthGuard } from './authentication/auth-guard.service';
import { AuthService } from './authentication/auth.service';
import { ResultService } from './services/result.service';
import { ClientService } from './services/client.service';
import { DepotService } from './services/depot.service';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

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
    DriverTodoComponent,
    DeleteDialogComponent
  ],
  entryComponents: [DeleteDialogComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpModule,
    MaterialModule,
    NgxDatatableModule,
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
    DepotService,
    DriverService,
    { provide: DateAdapter, useClass: MyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],

})

export class AppModule { }
