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
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
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
    if (this.selectedClient.length !== 1) {
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

    const temp = this.tempDepots.filter((data) => { 
      return data.depotName.toLowerCase().indexOf(val) !== -1 || !val; 
    }); 

    this.clients = temp; 
    this.clientTable.offset = 0; 
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

  addMockClient() {
    this.offset += 0.01
    this.clients.push({
      clientName: 'test Name',
      telephoneNumber: '1231564',
      address: 'test address',
      coordinate: [13.6526 + this.offset, 100.486328 + this.offset]
    })
  }
  
  test() {

  }

  ngOnDestroy() {
    this.numOfSelectedDepotSubScription.unsubscribe();
    this.numOfSelectedClientSubScription.unsubscribe();
  }

}
