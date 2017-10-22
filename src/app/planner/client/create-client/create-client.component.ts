import { FormControl } from '@angular/forms';
import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { MatButton, MatFormField, MatFormFieldControl, MatInput } from '@angular/material';
import { } from 'googlemaps';

import { Marker } from '../../../marker';
import { Client } from '../../../client';
import { ClientService } from '../../../shared/service/client.service';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.css']
})
export class CreateClientComponent implements OnInit {
  searchControl: FormControl;
  address;
  lat = 13.7563;
  lng = 100.5018;
  zoom = 11;

  client: any = {
    companyName: '',
    companyNumber: 0,
    branches: []
  };

  // rows, markers, and temp should observe client
  markers: Marker[] = [];
  rows = [];
  temp = [];
  selected = [];
  editing = {};

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    const branchMarkers: Marker[] = [];
    const companyId = this.activatedRoute.snapshot.queryParams.companyId;
    this.clientService.getClient(companyId).then((response) => {
      this.client = response;
      this.rows = this.client.branches;
      this.temp = [...this.client.branches];
      this.client.branches.map((branch) => {
        const branchMarker: Marker = {
          lat: 0,
          lng: 0,
          draggable: true
        };
        branchMarker.lat = branch.coordinate[0];
        branchMarker.lng = branch.coordinate[1];
        branchMarker.label = branch.branchName;
        branchMarker.draggable = true;
        branchMarkers.push(branchMarker);
      });
      this.markers = branchMarkers;
    });

    // this.searchControl = new FormControl();

    // this.setCurrentPosition();

    // // load Places Autocomplete
    // this.mapsAPILoader.load().then(() => {
    //   const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
    //     types: ["address"]
    //   });
    //   autocomplete.addListener("place_changed", () => {
    //     console.log("idiot");
    //     this.ngZone.run(() => {
    //       // get the place result
    //       const place: google.maps.places.PlaceResult = autocomplete.getPlace();

    //       // verify result
    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }

    //       // set latitude, longitude and zoom
    //       this.lat = place.geometry.location.lat();
    //       this.lng = place.geometry.location.lng();
    //       this.markers.push({
    //         lat: this.lat,
    //         lng: this.lng,
    //         draggable: true
    //       });
    //       this.zoom = 12;
    //     });
    //   });
    // });
  }

  mapClicked($event) {
    const latitude: number = ($event.coords.lat).toFixed(6);
    const longtitude: number = ($event.coords.lng).toFixed(6);
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
    this.rows.push({
      coordinate: [latitude, longtitude]
    });
    const lastIndex = this.rows.length - 1;
    this.rows[lastIndex].branchName = "New branch";
    this.editing[lastIndex + '-branchName'] = true;
    this.temp = this.rows;
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter((data) => {
      return data.branchName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
  }

  updateValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    console.log('UPDATED!', this.rows[rowIndex][cell]);
  }

  onSave() {

  }

  onDelete(rowIndex: number) {
    console.log(rowIndex);
    this.client.branches.splice(rowIndex, 1);
    this.rows.splice(rowIndex, 1);
    this.markers.splice(rowIndex, 1);
  }

  onDeleteAll() {
    this.client.branches = [];
    this.rows = [];
    this.markers = [];
  }

  onCancel() {
    this.router.navigate(['/planner/client']);
  }

  // private setCurrentPosition() {
  //   if ("geolocation" in navigator) {
  //     console.log(navigator);
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       console.log(position);
  //       this.lat = position.coords.latitude;
  //       this.lng = position.coords.longitude;
  //       this.zoom = 12;
  //     });
  //   }
  // }

  getAddress(event) {
    console.log(event);
    console.log(this.address);
  }
}
