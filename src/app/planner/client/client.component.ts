import { BehaviorSubject } from 'rxjs/Rx';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatButton, MatFormField, MatFormFieldControl } from '@angular/material';
import { NavigationExtras, Router } from '@angular/router';

import { Client } from '../../shared/client';
import { ClientService } from '../../services/client.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  rows = [];
  temp = [];

  constructor(private clientService: ClientService, private router: Router) { }

  ngOnInit() {
    this.clientService.getAllClients().then((response) => {
      this.rows = response;
      this.temp = [...this.rows];
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((data) => {
      return data.companyName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
  }

  onEdit(clientId) {
    this.router.navigate(['/planner/client/create'], { queryParams: { companyId: clientId } });
  }
}
