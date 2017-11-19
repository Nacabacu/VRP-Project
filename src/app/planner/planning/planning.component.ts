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
  @ViewChild(DatatableComponent) driverTable: DatatableComponent;
  // numOfDrivers = 2;
  // numOfDriversSubject = new Subject<number>();
  // numOfDriversSubScription: Subscription;

  // selectedDriver = [];
  // numOfSelectedDriverSubject = new Subject<number>();
  // numOfSelectedDriverSubScription: Subscription;

  // drivers = [];
  // tempDrivers = [];

  map = new Map;
  
  depots = [];
  selectedDepot = [];
  depotMarker: Marker;
  numOfSelectedDepotSubject = new Subject<number>();
  numOfSelectedDepotSubScription: Subscription;

  planningInfoGroup: FormGroup;
  depotGroup: FormGroup;
  driverFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverService,
    private depotService: DepotService
  ) { }

  ngOnInit() {
    // this.driverService.getDrivers().then((response) => {
      // response.drivers.forEach((driver) => {
      //   this.drivers.push(driver);
      // });
      // this.tempDrivers = [...this.drivers];
    // });

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

    // Drivers
    // this.driverFormGroup = this.formBuilder.group({
    //   capacity: new FormControl(null, [Validators.required]),
    //   driverTable: new FormControl(null, this.checkDriverSelected.bind(this))
    // });

    // this.numOfDriversSubScription = this.numOfDriversSubject.subscribe((value) => {
    //   this.driverFormGroup.get('driverTable').setValidators(this.checkDriverSelected.bind(this));
    //   this.driverFormGroup.get('driverTable').updateValueAndValidity();
    // });

    // this.numOfSelectedDriverSubScription = this.numOfSelectedDriverSubject.subscribe((value) => {
    //   this.driverFormGroup.get('driverTable').setValidators(this.checkDriverSelected.bind(this));
    //   this.driverFormGroup.get('driverTable').updateValueAndValidity();
    // });

    this.numOfSelectedDepotSubScription = this.numOfSelectedDepotSubject.subscribe((value) => {
      this.depotGroup.get('depotTable').setValidators(this.checkDepotSelected.bind(this));
      this.depotGroup.get('depotTable').updateValueAndValidity();
    });

    // Clients
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  // updateFilter(e) {
  //   const val = e.target.value.toLowerCase();

  //   const temp = this.tempDrivers.filter((data) => {
  //     return data.name.toLowerCase().indexOf(val) !== -1 || !val;
  //   });

  //   this.drivers = temp;
  //   this.driverTable.offset = 0;
  // }

  // onSelect({ selected }) {
  //   const numOfSelected = !this.selectedDriver ? 0 : this.selectedDriver.length;
  //   this.numOfSelectedDriverSubject.next(numOfSelected);
  //   this.selectedDriver.splice(0, this.selectedDriver.length);
  //   this.selectedDriver.push(...selected);
  // }

  // checkDriverSelected(control: FormControl): {[s: string]: boolean} {
  //   if (this.numOfDrivers !== this.selectedDriver.length) {
  //     return({selectedDriverError: true});
  //   } else {
  //     return(null);
  //   }
  // }

  // onDriverSliderChange(e) {
  //   this.numOfDrivers = e.value;
  //   this.numOfDriversSubject.next(e.value);
  // }

  checkDepotSelected(control: FormControl): { [s: string]: boolean } {
    if (this.selectedDepot.length !== 1) {
      return { selectedDepotError: true };
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

  test2() {
    console.log(this.depotGroup)
  }
  test3() {
    console.log(this.planningInfoGroup)
  }

  test() {

  }

  ngOnDestroy() {
    // this.numOfDriversSubScription.unsubscribe();
    // this.numOfSelectedDriverSubScription.unsubscribe();
  }

}
