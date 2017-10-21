import { DriverTodoComponent } from './driver/driver-todo/driver-todo.component';
import { PlannerTodoComponent } from './planner/planner-todo/planner-todo.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './authentication/auth-guard.service';

import { DriverComponent } from './driver/driver.component';
import { DrivingResultComponent } from './driver/driving-result/driving-result.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { LoginComponent } from './login/login.component';
import { ClientComponent } from './planner/client/client.component';
import { CreateClientComponent } from './planner/client/create-client/create-client.component';
import { CreateDepotComponent } from './planner/depot/create-depot/create-depot.component';
import { DepotComponent } from './planner/depot/depot.component';
import { PlannerComponent } from './planner/planner.component';
import { PlanningResultComponent } from './planner/planning-result/planning-result.component';
import { PlanningComponent } from './planner/planning/planning.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'planner', component: PlannerComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
      {
        path: '',
        component: PlannerTodoComponent
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
            path: 'create/[:id]',
            component: CreateClientComponent
          }
        ]
      },
      {
        path: 'depot',
        component: DepotComponent,
        children: [
          {
            path: 'create/[:id]',
            component: CreateDepotComponent
          }
        ]
      }
  ]
  },
  {
    path: 'driver', component: DriverComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
      {
        path: '',
        component: DriverTodoComponent
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
