import { Client } from '../../client';
import { BehaviorSubject } from 'rxjs/Rx';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatButton, MatFormField, MatFormFieldControl } from '@angular/material';
import { NavigationExtras, Router } from '@angular/router';


import { ClientService } from '../../shared/service/client.service';
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
  displayedColumns = ['companyNumber', 'companyName', 'branches', 'edit'];
  clientDatabase = new ClientDatabase(this.clientService);
  dataSource: ClientSource | null;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private clientService: ClientService, private router: Router) { }

  ngOnInit() {
    const that = this;
    this.clientService.getAllClients().then(function (response) {
      that.dataSource = new ClientSource(that.clientDatabase, that.paginator);
    });

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  onEditClient(companyNumber: number) {
    this.router.navigate(['/planner/client/create'], { queryParams: { companyNumber: companyNumber } });
  }
}

export class ClientDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Client[]> = new BehaviorSubject<Client[]>([]);
  get data(): Client[] { return this.dataChange.value; }

  constructor(private clientService: ClientService) {
    const that = this;
    this.clientService.getAllClients().then(function (response) {
      that.dataChange.next(response);
    });
  }
}

export class ClientSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }
  constructor(private _clientDatabase: ClientDatabase, private _paginator: MatPaginator) {
    super();
  }

  connect(): Observable<Client[]> {
    const displayData = [
      this._clientDatabase.dataChange,
      this._paginator.page,
    ];

    return Observable.merge(...displayData).map(() => {
      const data = this._clientDatabase.data.slice();

      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
    });
  }

  //   former filter logic
  //   return Observable.merge(...displayData).map(() => {
  // return this.clientData.filter((item: Client) => {
  //   const searchString = (item.companyName).toLowerCase();
  //   return searchString.indexOf(this.filter.toLowerCase()) !== -1;
  // });
  //   });
  // }

  disconnect() { }
}
