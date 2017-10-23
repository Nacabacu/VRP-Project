import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { MatButton, MatFormField, MatFormFieldControl, MatInput } from '@angular/material';
import { } from 'googlemaps';

import { ClientService } from '../../../services/client.service';
import { Marker } from '../../../shared/marker';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.css']
})
export class CreateClientComponent implements OnInit {
  searchControl: FormControl;
  isNew: boolean = false;
  address;
  zoom;
  lat;
  lng;
  
  editForm: FormGroup;

  client: any = {
    companyName: '',
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
    if (companyId) {
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
    } else {
      this.isNew = true;
    }
      
      this.editForm = new FormGroup({
      'bname': new FormControl(null, Validators.required)
        
    });

    this.searchControl = new FormControl();

    this.setCurrentPosition();

    // load Places Autocomplete
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
          this.zoom = 15;
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();

          this.markers.push({
            lat: this.lat,
            lng: this.lng,
            draggable: true
          });

          this.rows.push({
            coordinate: [this.lat, this.lng]
          });

          const lastIndex = this.rows.length - 1;
          this.rows[lastIndex].branchName = this.searchElementRef.nativeElement.value;
          this.editing[lastIndex + '-branchName'] = true;
        });
      });
    });
  }

  mapClicked($event) {
    const latitude: number = $event.coords.lat;
    const longtitude: number = $event.coords.lng;
    this.markers.push({
      lat: latitude,
      lng: longtitude,
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

  markerDragEnd(marker: Marker, event, index: number) {
    this.rows[index].coordinate[0] = event.coords.lat;
    this.rows[index].coordinate[1] = event.coords.lng;
    this.rows[index].coordinate = [event.coords.lat, event.coords.lng];
    this.rows = [...this.rows];
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
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

  onRowSelected() {
    this.lat = this.selected[0].coordinate[0];
    this.lng = this.selected[0].coordinate[1];
    this.zoom = 15;
  }

  onSave() {
    this.client.branches = this.rows;
    if (this.isNew) {
      this.clientService.createClient(this.client).then((response) => {
        this.router.navigate(['/planner/client']);
      });
    } else {
      console.log("Fuck up with CORS");
      // this.clientService.updateClient(this.client).then((response) => {
      //   this.router.navigate(['/planner/client']);
      // });
    }
  }

  onDelete(rowIndex: number) {
    console.log(rowIndex);
    this.client.branches.splice(rowIndex, 1);
    this.rows.splice(rowIndex, 1);
    this.markers.splice(rowIndex, 1);
  }

  onDeleteAll() {
    this.clientService.deleteClient(this.client._id).then((response) => {
      this.router.navigate(['/planner/client']);
    });
  }

  onCancel() {
    this.router.navigate(['/planner/client']);
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }
  
}
