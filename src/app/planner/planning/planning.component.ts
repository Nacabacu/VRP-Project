import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { DepotService } from '../../services/depot.service';

import { ClientService } from '../../services/client.service';
import { DriverService } from './../../services/driver.service';

import { Marker } from '../../shared/marker';
import { Map } from '../../shared/map';
import { Client } from '../../shared/client';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlanningComponent implements OnInit, OnDestroy {
  @ViewChild(DatatableComponent) driverTable: DatatableComponent;

  map = new Map();
  markers: Marker[];
  numOfDrivers = 2;
  numOfDriversSubject = new Subject<number>();
  numOfDriversSubScription: Subscription;

  selectedDriver = [];
  numOfSelectedDriverSubject = new Subject<number>();
  numOfSelectedDriverSubScription: Subscription;

  drivers = [];
  tempDrivers = [];

  tempClients = [];
  casualClients = [];
  regularClients = [];
  selectedRegularClients = [];
  selectedCasualClient = [];
  regularClientMarkers: Marker[] = [];
  casualClientMarkers: Marker[] = [];
  numOfSelectedClientSubject = new Subject<number>();
  numOfSelectedClientSubScription: Subscription;
  editing = {};
  capacityCtrl: FormArray;

  planningInfoGroup: FormGroup;
  driverFormGroup: FormGroup;
  clientFormGroup: FormGroup;

  rows = [];
  temps = [];
  selected = [];
  numOfSelectedDepotSubject = new Subject<number>();
  numOfSelectedDepotSubScription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverService,
    private clientService: ClientService,
    private depotService: DepotService,
    public dialog: MatDialog
  ) {
    // Planning
    this.planningInfoGroup = this.formBuilder.group({
      date: new FormControl(null, Validators.required),
      hour: new FormControl(null, Validators.required),
      minute: new FormControl(null, Validators.required),
      method: new FormControl('distance'),
      depotTable: new FormControl(null, this.checkDepotSelected.bind(this))
    });

    // Drivers
    this.driverFormGroup = this.formBuilder.group({
      capacity: new FormControl(null, [Validators.required]),
      driverTable: new FormControl(null, this.checkDriverSelected.bind(this))
    });

    // Clients
    this.clientFormGroup = this.formBuilder.group({
      clientTable: new FormControl(null, this.checkClientSelected.bind(this)),
    });
  }

  ngOnInit() {
    //Depot
    this.depotService.getAllDepots().then((response) => {
      this.rows = response;
      this.temps = [...this.rows];
    });

    this.driverService.getDrivers().then((response) => {
      response.drivers.forEach((driver) => {
        this.drivers.push(driver);
      });
      this.tempDrivers = [...this.drivers];
    });

    this.clientService.getAllClients().then((response) => {
      response.map((client) => {
        client.branches.map((branch) => {
          const regularClient: any = {};
          regularClient.companyName = client.companyName;
          regularClient.branchName = branch.branchName;
          regularClient.coords = branch.coordinate;
          regularClient.capacity = 0;
          this.regularClients.push(regularClient);
        });
      });
      this.tempClients = [...this.regularClients];
    });

    this.numOfSelectedDepotSubScription = this.numOfSelectedDepotSubject.subscribe((value) => {
      this.planningInfoGroup.get('depotTable').setValidators(this.checkDepotSelected.bind(this));
      this.planningInfoGroup.get('depotTable').updateValueAndValidity();
    });

    this.numOfDriversSubScription = this.numOfDriversSubject.subscribe((value) => {
      this.driverFormGroup.get('driverTable').setValidators(this.checkDriverSelected.bind(this));
      this.driverFormGroup.get('driverTable').updateValueAndValidity();
    });

    this.numOfSelectedDriverSubScription = this.numOfSelectedDriverSubject.subscribe((value) => {
      this.driverFormGroup.get('driverTable').setValidators(this.checkDriverSelected.bind(this));
      this.driverFormGroup.get('driverTable').updateValueAndValidity();
    });

    this.numOfSelectedClientSubScription = this.numOfSelectedClientSubject.subscribe((value) => {
      this.clientFormGroup.get('clientTable').setValidators(this.checkClientSelected.bind(this));
      this.clientFormGroup.get('clientTable').updateValueAndValidity();
    });
  }

  updateFilter(e) {
    const val = e.target.value.toLowerCase();

    const temp = this.tempDrivers.filter((data) => {
      return data.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.drivers = temp;
    this.driverTable.offset = 0;
  }

  onSelect({ selected }) {
    const numOfSelected = !this.selectedDriver ? 0 : this.selectedDriver.length;
    this.numOfSelectedDriverSubject.next(numOfSelected);
    this.selectedDriver.splice(0, this.selectedDriver.length);
    this.selectedDriver.push(...selected);
  }

  checkDepotSelected(control: FormControl): { [s: string]: boolean } {
    if (this.selected.length < 1) {
      return ({ selectedDepotError: true });
    } else {
      return (null);
    }
  }

  checkDriverSelected(control: FormControl): { [s: string]: boolean } {
    if (this.numOfDrivers !== this.selectedDriver.length) {
      return ({ selectedDriverError: true });
    } else {
      return (null);
    }
  }

  checkClientSelected(control: FormControl): { [s: string]: boolean } {
    if (this.selectedRegularClients.length < 1 || this.selectedRegularClients.length > 25) {
      return ({ selectedClientError: true });
    } else {
      return (null);
    }
  }

  onDriverSliderChange(e) {
    this.numOfDrivers = e.value;
    this.numOfDriversSubject.next(e.value);
  }

  onHourBlur(e) {
    if (e.target.valueAsNumber > 23) {
      this.planningInfoGroup.get('hour').setValue(24);
    }
  }

  onMinuteBlur(e) {
    if (e.target.valueAsNumber > 59) {
      this.planningInfoGroup.get('minute').setValue(59);
    }
  }

  dateFilter(date: Date): boolean {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    return date >= currentDate;
  }

  createMarkers(dataset) {
    const markers: Marker[] = [];
    dataset.map((data, index) => {
      markers.push({
        lat: data.coords[0],
        lng: data.coords[1],
        draggable: false
      });
    });
    return markers;
  }

  mapClicked($event) {
    const latitude: number = $event.coords.lat;
    const longtitude: number = $event.coords.lng;
    this.casualClientMarkers.push({
      lat: latitude,
      lng: longtitude,
      draggable: true
    });
    this.casualClients.push({
      coordinate: [latitude, longtitude],
      location: "New Location"
    });
    const lastIndex = this.casualClients.length - 1;
    this.casualClients[lastIndex].branchName = "";
    this.editing[lastIndex + '-location'] = true;
  }

  markerDragEnd(marker: Marker, event, index: number) {
    this.casualClients[index].coordinate = [event.coords.lat, event.coords.lng];
    this.casualClients = [...this.casualClients];
  }

  onRegularClientSelected({ selected }) {
    this.selectedRegularClients = selected;
    this.regularClientMarkers = this.createMarkers(selected);
    this.numOfSelectedClientSubject.next(selected.length);
  }

  onDeleteCasualClient(rowIndex) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.casualClientMarkers.splice(rowIndex, 1);
        this.casualClients.splice(rowIndex, 1);
      }
    });
  }

  updateClientFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempClients.filter((data) => {
      return data.branchName.toLowerCase().indexOf(val) !== -1 ||
        data.companyName.toLowerCase().indexOf(val) !== -1 ||
        !val;
    });
    this.regularClients = temp;
  }

  updateCasualClientCellValue(event, cell, rowIndex) {
    this.casualClients[rowIndex][cell] = event.target.value;
    if (event.target.value !== "") {
      this.editing[rowIndex + '-' + cell] = false;
      this.casualClients = [...this.casualClients];
    }
  }


  onRowSelected({ selected }) {
    this.map.lat = this.selected[0].lat;
    this.map.lng = this.selected[0].lng;
    this.map.zoom = 16;
    this.numOfSelectedDepotSubject.next(selected.length);
  }

  test() {
    console.log("Lorem");
  }

  //FilterDepot
  updateFilterDepot(event) {
    const valSearch = event.target.value.toLowerCase();
    const tempSearch = this.temps.filter((data) => {
      return data.depotName.toLowerCase().indexOf(valSearch) !== -1 || !valSearch;
    });

    // update the rows
    this.rows = tempSearch;

  }

  ngOnDestroy() {
    this.numOfDriversSubScription.unsubscribe();
    this.numOfSelectedDriverSubScription.unsubscribe();
  }

}

