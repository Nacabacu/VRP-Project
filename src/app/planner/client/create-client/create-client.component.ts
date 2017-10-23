import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  companyNameInput = new FormControl(null, Validators.required);
  searchControl: FormControl;
  isNew: boolean = false;
  isBranchNameValid: boolean = true;
  address;
  zoom;
  lat;
  lng;

  client: any = {
    companyName: '',
    branches: []
  };

  markers: Marker[] = [];
  temp = [];
  selected = [];
  editing = {};

  @ViewChild("search") public searchElementRef: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
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
        this.temp = [...this.client.branches];
        this.renderMarkers();
      });
    } else {
      this.isNew = true;
    }

    this.searchControl = new FormControl();
    this.setCurrentPosition();

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
          this.zoom = 16;
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();

          this.markers.push({
            lat: this.lat,
            lng: this.lng,
            draggable: true
          });
        });
      });
    });
  }

  mapClicked($event) {
    const latitude: number = $event.coords.lat;
    const longtitude: number = $event.coords.lng;
    this.client.branches.push({
      coordinate: [latitude, longtitude]
    });
    this.renderMarkers();
    const lastIndex = this.client.branches.length - 1;
    this.client.branches[lastIndex].branchName = "";
    this.editing[lastIndex + '-branchName'] = true;
    this.temp = [...this.client.branches];
    this.isBranchNameValid = false;
  }

  markerDragEnd(marker: Marker, event, index: number) {
    this.client.branches[index].coordinate = [event.coords.lat, event.coords.lng];
    this.client.branches = [...this.client.branches];
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((data) => {
      return data.branchName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.client.branches = temp;
  }

  updateValue(event, cell, rowIndex) {
    this.client.branches[rowIndex][cell] = event.target.value;
    if (event.target.value !== "") {
      this.editing[rowIndex + '-' + cell] = false;
      this.client.branches = [...this.client.branches];
    }
    this.checkBranchName();
    console.log(this.client.branches, this.temp);
  }

  checkBranchName() {
    let isValid: boolean = true;
    this.client.branches.map((branch, i) => {
      if (branch.branchName === "") {
        isValid = false;
        this.isBranchNameValid = false;
      }
      if (i === this.client.branches.length - 1) {
        if (isValid) {
          this.isBranchNameValid = true;
        }
      }
    });
  }

  renderMarkers() {
    this.markers = [];
    this.client.branches.map((branch, index) => {
      this.markers.push({
        lat: branch.coordinate[0],
        lng: branch.coordinate[1],
        label: (index + 1).toString(),
        draggable: true
      });
    });
  }

  onRowSelected() {
    this.lat = this.selected[0].coordinate[0];
    this.lng = this.selected[0].coordinate[1];
  }

  onSave() {
    this.client.branches = this.temp;
    if (this.isNew) {
      this.clientService.createClient(this.client).then((response) => {
        this.router.navigate(['/planner/client']);
      });
    } else {
      this.clientService.updateClient(this.client).then((response) => {
        this.router.navigate(['/planner/client']);
      });
    }
  }

  onDelete(rowIndex: number) {
    this.client.branches.splice(rowIndex, 1);
    this.markers.splice(rowIndex, 1);
    this.temp = [...this.client.branches];
    this.renderMarkers();
    this.checkBranchName();
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
