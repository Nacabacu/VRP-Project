import { BehaviorSubject } from 'rxjs/Rx';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatButton } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ClientService } from '../../client.service';
import { Company } from '../../company';
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
  displayedColumns = ['companyNumber', 'companyName', 'numberOfBranch', 'edit'];
  dataSource = new ExampleDataSource([]) || null;

  @ViewChild('filter') filter: ElementRef;

  constructor(private clientService: ClientService, private router: Router) { }

  ngOnInit() {
    const that = this;
    this.clientService.getCompany().then(function (response) {
      that.dataSource = new ExampleDataSource(response);
    });
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }

  onEditClient($event) {
    console.log($event);
    this.router.navigate(['/planner/client/id']);
  }
}

export class ExampleDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }
  constructor(private companyData: Company[]) {
    super();
  }

  connect(): Observable<Company[]> {
    const displayData = [
      this.companyData,
      this._filterChange
    ];

    // return Observable.of(this.companyData);

    return Observable.merge(...displayData).map(() => {
      return this.companyData.filter((item: Company) => {
        const searchString = (item.companyName).toLowerCase();
        return searchString.indexOf(this.filter.toLowerCase()) !== -1;
      });
    });
  }

  disconnect() { }
}
