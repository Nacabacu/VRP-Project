import { DepotService } from './../../services/depot.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { DriverService } from './../../services/driver.service';
import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Observable } from 'rxjs/Observable';

import { Marker } from '../../shared/marker';
import { Map } from '../../shared/map';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlanningComponent implements OnInit, OnDestroy {
  map = new Map;
  
  depots = [];
  selectedDepot = [];
  depotMarker: Marker;
  numOfSelectedDepotSubject = new Subject<number>();
  numOfSelectedDepotSubScription: Subscription;
  
  clients = [];
  selectedClient = [];
  clientMarker: Marker;
  numOfSelectedClienttSubject = new Subject<number>();
  numOfSelectedClientSubScription: Subscription;

  planningInfoGroup: FormGroup;
  depotGroup: FormGroup;
  clientGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverService,
    private depotService: DepotService
  ) { }

  ngOnInit() {
    this.depotService.getAllDepots().then((response) => {
      this.depots = response;
    });

    // Planning
    this.planningInfoGroup = this.formBuilder.group({
      date: new FormControl(null, Validators.required),
      time: new FormControl(null, Validators.required),
      numOfDrivers: new FormControl(null, Validators.required),
      capacity: new FormControl(null, Validators.required),
      method: new FormControl('distance'),
    });

    // Depot
    this.depotGroup = this.formBuilder.group({
      depotTable: new FormControl(null, this.checkDepotSelected.bind(this))
    })

    // Clients
    this.clientGroup = this.formBuilder.group({
      clientTable: new FormControl(null, this.checkClientSelected.bind(this))
    });

    this.numOfSelectedDepotSubScription = this.numOfSelectedDepotSubject.subscribe((value) => {
      this.depotGroup.get('depotTable').setValidators(this.checkDepotSelected.bind(this));
      this.depotGroup.get('depotTable').updateValueAndValidity();
    });
  }

  checkDepotSelected(control: FormControl): { [s: string]: boolean } {
    if (this.selectedDepot.length !== 1) {
      return { selectedDepotError: true };
    } else {
      return null;
    }
  }

  checkClientSelected(control: FormControl): { [s: string]: boolean } {
    if (this.selectedClient.length !== 1) {
      return { selectedClientError: true };
    } else {
      return null;
    }
  }

  dateFilter(date: Date): boolean {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    return date >= currentDate;
  }

  onDepotSelected({ selected }) {
    this.depotMarker = {
      lat: selected[0].coordinate[0],
      lng: selected[0].coordinate[1],
      draggable: false
    }
    this.map.lat = selected[0].coordinate[0];
    this.map.lng = selected[0].coordinate[1];
    this.map.zoom = 15;
    this.numOfSelectedDepotSubject.next(selected.length);
  }
  
  test() {

  }

  ngOnDestroy() {
    this.numOfSelectedDepotSubScription.unsubscribe();
    // this.numOfDriversSubScription.unsubscribe();
    // this.numOfSelectedDriverSubScription.unsubscribe();
  }

}
