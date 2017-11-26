import { Router, ActivatedRoute } from '@angular/router';
import { ResultService } from './../../services/result.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation, NgZone, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { DepotService } from './../../services/depot.service';
import { DriverService } from './../../services/driver.service';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Observable } from 'rxjs/Observable';

import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';

import { Marker } from '../../shared/marker';
import { Map } from '../../shared/map';

import { ClientPickerDialogComponent } from '../../shared/client-picker-dialog/client-picker-dialog.component';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlanningComponent implements OnInit, OnDestroy {
  @ViewChild(DatatableComponent) depotTable: DatatableComponent;
  @ViewChild(DatatableComponent) clientTable: DatatableComponent;
  @ViewChild("searchMap") public searchElementRef: ElementRef;

  map = new Map;
  searchLocationInput;
  offset = 0;

  depots = [];
  tempDepots = [];
  selectedDepot = [];
  depotMarker: Marker;
  numOfSelectedDepotSubject = new Subject<number>();
  numOfSelectedDepotSubScription: Subscription;

  clients = [];
  tempClients = [];
  selectedClient = [];
  clientMarker: Marker;
  numOfSelectedClientSubject = new Subject<number>();
  numOfSelectedClientSubScription: Subscription;

  searchMarker: Marker;

  planningInfoGroup: FormGroup;
  depotGroup: FormGroup;
  clientGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverService,
    private depotService: DepotService,
    private resultService: ResultService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.map.zoom = 18;
          this.map.lat = place.geometry.location.lat();
          this.map.lng = place.geometry.location.lng();

          this.searchMarker = {
            lat: this.map.lat,
            lng: this.map.lng,
            draggable: false
          };
        });
      });
    });

    this.depotService.getAllDepots().then((response) => {
      this.depots = response;
      this.tempDepots = this.depots;
    });

    // Planning
    this.planningInfoGroup = this.formBuilder.group({
      date: new FormControl(null, Validators.required),
      time: new FormControl(null, Validators.required),
      numOfDrivers: new FormControl(null, Validators.required),
      capacity: new FormControl(null, Validators.required),
      method: new FormControl('distance')
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

    this.numOfSelectedClientSubScription = this.numOfSelectedClientSubject.subscribe((value) => {
      this.clientGroup.get('clientTable').setValidators(this.checkClientSelected.bind(this));
      this.clientGroup.get('clientTable').updateValueAndValidity();
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
    if (this.clients.length === 0) {
      return { selectedClientError: true };
    } else {
      return null;
    }
  }

  updateDepotFilter(e) {
    const val = e.target.value.toLowerCase();

    const temp = this.tempDepots.filter((data) => {
      return data.depotName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.depots = temp;
    this.depotTable.offset = 0;
  }

  updateClientFilter(e) {
    const val = e.target.value.toLowerCase();

    const temp = this.tempClients.filter((data) => {
      return data.phoneNumber.toLowerCase().indexOf(val) !== -1 || data.clientName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.clients = temp;
    this.clientTable.offset = 0;
  }

  editClient(index) {
    const dialogRef = this.dialog.open(ClientPickerDialogComponent, {
      width: '80vw',
      data: this.clients[index]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.clients[index] = result;
        this.tempClients = this.clients;
      }
    });
  }

  removeClient(index) {
    this.clients.splice(index, 1);
    this.tempClients = this.clients;
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

  onClientSelected({ selected }) {
    this.map.lat = selected[0].coordinate[0];
    this.map.lng = selected[0].coordinate[1];
    this.map.zoom = 15;
  }

  onAddClient(rowIndex: number) {
    const dialogRef = this.dialog.open(ClientPickerDialogComponent, {
      width: '80vw',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.clients.push(result);
        this.tempClients = this.clients;
        this.numOfSelectedClientSubject.next(this.clients.length);
      }
    });
  }

  addMockClient() {
    this.offset += 0.01
    this.clients.push({
      clientName: 'test Name',
      phoneNumber: '1231564',
      address: 'test address',
      demand: 1,
      waitTime: 30,
      coordinate: [13.6526 + this.offset, 100.486328 + this.offset]
    })
    this.tempClients = this.clients;
  }

  onSubmit() {
    if (this.planningInfoGroup.valid && this.depotGroup.valid && this.clientGroup.valid) {
      var date = new Date(this.planningInfoGroup.value.date);
      var time = (parseInt(this.planningInfoGroup.value.time) - 7).toString();
      if (parseInt(time) < 10) {
        time = '0' + time;
      }

      var day = date.getDate().toString();
      if (parseInt(day) < 10) {
        day = '0' + day;
      }

      var month = (date.getMonth() +1).toString();
      if (parseInt(month) < 10) {
        month = '0' + month;
      }
      const request = {
        date: date.getFullYear() + '-' + month + '-' + day + 'T' + time + ':00:00.000Z',
        method: this.planningInfoGroup.value.method,
        numVehicles: this.planningInfoGroup.value.numOfDrivers,
        vehicleCapacity: this.planningInfoGroup.value.capacity,
        depot: {
          depotName: this.selectedDepot[0].depotName,
          coordinate: this.selectedDepot[0].coordinate
        },
        clients: this.clients
      }
      this.resultService.saveResult(request).then((res) => {
        const id = res._body.replace(/\"/g, '');

        // this.router.navigate(['/planner/result', id]);
      }).catch((err) => {
        this.snackBar.open('Cannot find the solution', 'close', {
          duration: 2000,
        });
      });
    }
    else {
      this.snackBar.open('Please valid planning form', 'close', {
        duration: 2000,
      });
    }
  }

  ngOnDestroy() {
    this.numOfSelectedDepotSubScription.unsubscribe();
    this.numOfSelectedClientSubScription.unsubscribe();
  }

}
