import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { ClientPickerDialogComponent } from './client-picker-dialog/client-picker-dialog.component';

import { DepotService } from '../../services/depot.service';
import { ClientService } from '../../services/client.service';
import { DriverService } from './../../services/driver.service';
import { ResultService } from '../../services/result.service';

import { IPlanning } from '../../shared/planning';
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
  // dialogClients = [];
  selectedRegularClients = [];
  selectedCasualClient = [];
  regularClientMarkers: Marker[] = [];
  casualClientMarkers: Marker[] = [];
  numOfSelectedClientSubject = new Subject<number>();
  numOfSelectedClientSubScription: Subscription;
  editing = {};
  isAllInputFill = true;
  isCasualClientValid = true;
  capacityCtrl: FormArray;

  planningInfoGroup: FormGroup;
  driverFormGroup: FormGroup;
  clientFormGroup: FormGroup;

  rows = [];
  temps = [];
  selectedDepot = [];
  numOfSelectedDepotSubject = new Subject<number>();
  numOfSelectedDepotSubScription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverService,
    private clientService: ClientService,
    private depotService: DepotService,
    private resultService: ResultService,
    private router: Router,
    public dialog: MatDialog
  ) {
    // Planning
    this.planningInfoGroup = this.formBuilder.group({
      dateTime: new FormControl(null, Validators.required),
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
          // regularClient.clientName = client.companyName + " - " + branch.branchName;
          regularClient.coordinate = branch.coordinate;
          regularClient.demand = 0;
          regularClient.waitTime = 0;
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
    if (this.selectedDepot.length < 1) {
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
    const selectedClient = this.selectedRegularClients.length + this.casualClients.length
    if (selectedClient < 1 || selectedClient > 25) {
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
      this.planningInfoGroup.get('hour').setValue(0);
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
        lat: data.coordinate[0],
        lng: data.coordinate[1],
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
      location: "New Location",
      demand: 0,
      waitTime: 0
    });
    const lastIndex = this.casualClients.length - 1;
    this.casualClients[lastIndex].branchName = "";
    this.editing[lastIndex + '-location'] = true;
    this.numOfSelectedClientSubject.next(this.casualClients.length);
    this.validateCasualClient();
  }

  markerDragEnd(marker: Marker, event, index: number) {
    this.casualClients[index].coordinate = [event.coords.lat, event.coords.lng];
    this.casualClients = [...this.casualClients];
  }

  onRegularClientSelected({ selected }) {
    this.checkAllInputFill();
    if (selected) {
      this.checkAllInputFill();
      this.selectedRegularClients = selected;
      this.regularClientMarkers = this.createMarkers(selected);
      this.numOfSelectedClientSubject.next(selected.length);
    }
  }

  onDeleteCasualClient(rowIndex) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.casualClientMarkers.splice(rowIndex, 1);
        this.casualClients.splice(rowIndex, 1);
        this.numOfSelectedClientSubject.next(this.casualClients.length);
        this.validateCasualClient();
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
      this.validateCasualClient();
    }
  }

  updateRegularClientCellValue(event, cell, rowIndex) {
    if (event.target.value > 0) {
      this.regularClients[rowIndex][cell] = event.target.value;
      // this.selectedRegularClients[this.selectedRegularClients.length - 1][cell] = event.target.value;
      // console.log(this.selectedRegularClients);
      this.regularClients = [...this.regularClients];
      this.checkAllInputFill();
    }
  }

  checkAllInputFill() {
    let isValid: boolean = true;
    if (this.selectedRegularClients.length === 0) {
      this.isAllInputFill = true;
    };
    this.selectedRegularClients.map((client, i) => {
      if (client.demand < 1 || client.waitTime < 1) {
        isValid = false;
        this.isAllInputFill = false;
      }
      if (i === this.selectedRegularClients.length - 1) {
        if (isValid) {
          this.isAllInputFill = true;
        }
      }
    });
  }

  validateCasualClient() {
    console.log()
    let isValid: boolean = true;
    if (this.casualClients.length === 0) {
      this.isCasualClientValid = true;
    };
    this.casualClients.map((client, i) => {
      if (client.location.length < 1 || client.demand < 1 || client.waitTime < 0) {
        isValid = false;
        this.isCasualClientValid = false;
      }
      if (i === this.casualClients.length - 1) {
        if (isValid) {
          this.isCasualClientValid = true;
        }
      }
    });
  }

  onRowSelected({ selected }) {
    this.map.lat = this.selectedDepot[0].lat;
    this.map.lng = this.selectedDepot[0].lng;
    this.map.zoom = 16;
    this.numOfSelectedDepotSubject.next(selected.length);
  }

  test() {
    console.log("Lorem");
  }

  // onAddClient(rowIndex: number) {
  //   const dialogRef = this.dialog.open(ClientPickerDialogComponent, {
  //     width: '80vw'
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       console.log(result);
  //       this.dialogClients.push(result);
  //       // this.client.branches.splice(rowIndex, 1);
  //       // this.markers.splice(rowIndex, 1);
  //       // this.temp = [...this.client.branches];
  //       // this.renderMarkers();
  //       // this.checkBranchName();
  //     }
  //   });
  // }

  //FilterDepot
  updateFilterDepot(event) {
    const valSearch = event.target.value.toLowerCase();
    const tempSearch = this.temps.filter((data) => {
      return data.depotName.toLowerCase().indexOf(valSearch) !== -1 || !valSearch;
    });

    // update the rows
    this.rows = tempSearch;

  }

  onSave() {
    const routeFixed = [];

    this.regularClients.map((client) => {
      client.demand = parseInt(client.demand);
      client.waitTime = parseInt(client.waitTime) * 60;
      client.clientName = client.companyName + " - " + client.branchName;
    });

    this.selectedCasualClient.map((client) => {
      client.demand = parseInt(client.demand);
      client.waitTime = parseInt(client.waitTime) * 60;
      this.selectedRegularClients.push(client);
    });

    this.drivers.map(() => {
      routeFixed.push([]);
    });

    this.selectedDepot[0].coordinate = [this.selectedDepot[0].lat, this.selectedDepot[0].lng];

    const planningData: IPlanning = {
      date: this.planningInfoGroup.value.dateTime,
      method: this.planningInfoGroup.value.method,
      workingHour: 8,
      numVehicles: this.selectedDriver.length,
      vehicleCapacity: this.driverFormGroup.value.capacity,
      routeLocks: routeFixed,
      depot: this.selectedDepot[0],
      drivers: this.selectedDriver,
      clients: this.selectedRegularClients
    }
    this.resultService.createPlanning(planningData).then((response) => {
      console.log(response);
      this.router.navigate(['/planner']);
    });
  }

  ngOnDestroy() {
    this.numOfDriversSubScription.unsubscribe();
    this.numOfSelectedDriverSubScription.unsubscribe();
    this.numOfSelectedClientSubScription.unsubscribe();
    this.numOfSelectedDepotSubScription.unsubscribe();
  }

}

