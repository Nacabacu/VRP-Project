import { AuthGuard } from './auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'planner', component: PlannerComponent, canActivateChild: [AuthGuard], children: [
      {
        path: '',
        component: PlannerHistoryComponent
      },
      {
        path: 'planning/:id',
        component: PlanningComponent
      },
      {
        path: 'planning/result/:id',
        component: PlanningResultComponent
      },
      {
        path: 'client',
        component: ClientComponent,
        children: [
          {
            path: ':id',
            component: CreateClientComponent
          }
        ]
      },
      {
        path: 'depot',
        component: DepotComponent,
        children: [
          {
            path: ':id',
            component: CreateDepotComponent
          }
        ]
      }
    ]
  },
  {
    path: 'driver', component: DriverComponent, canActivateChild: [AuthGuard], children: [
      {
        path: '',
        component: DriverHomeComponent
      },
      {
        path: 'todo/:id',
        component: TodoDriverComponent
      },
      {
        path: 'result/:id',
        component: DrivingResultComponent
      }
    ]
  },
  { path: 'not-found', component: ErrorPageComponent, data: { message: 'Page not found!' } },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
