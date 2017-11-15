import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import {
  MatDialog,
  MatButton,
  MatFormField,
  MatFormFieldControl,
  MatInput
} from '@angular/material';

import { DepotService } from '../../services/depot.service';

import { Marker } from '../../shared/marker';
import { Map } from '../../shared/map';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-depot',
  templateUrl: './depot.component.html',
  styleUrls: ['./depot.component.css']
})
export class DepotComponent implements OnInit {
  searchControl: FormControl;
  isDepotNameValid: boolean = true;
  map = new Map();

  depots: any[];

  markers: Marker[] = [];
  temp = [];
  selectedDepot = [];
  editing = {};

  @ViewChild("search") public searchElementRef: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private depotService: DepotService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.depotService.getAllDepots().then((response) => {
      console.log(response)
      this.depots = response;
      this.temp = [...this.depots];
      this.renderMarkers();
    });

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
          this.map.zoom = 16;
          this.map.lat = place.geometry.location.lat();
          this.map.lng = place.geometry.location.lng();

          this.markers.push({
            lat: this.map.lat,
            lng: this.map.lng,
            draggable: false
          });
        });
      });
    });
  }

  mapClicked($event) {
    const latitude: number = $event.coords.lat;
    const longtitude: number = $event.coords.lng;
    this.depots.push({
      coordinate: [latitude, longtitude]
    });
    this.renderMarkers();
    const lastIndex = this.depots.length - 1;
    this.depots[lastIndex].depotName = "";
    this.editing[lastIndex + '-depotName'] = true;
    this.temp = [...this.depots];
    this.isDepotNameValid = false;
  }

  markerDragEnd(marker: Marker, event, index: number) {
    this.depots[index].coordinate = [event.coords.lat, event.coords.lng];
    this.depots = [...this.depots];
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((data) => {
      return data.depotName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.depots = temp;
  }

  updateValue(event, cell, rowIndex) {
    this.depots[rowIndex][cell] = event.target.value;
    if (event.target.value !== "") {
      this.editing[rowIndex + '-' + cell] = false;
      this.depots = [...this.depots];
    }
    this.checkBranchName();
  }

  checkBranchName() {
    let isValid: boolean = true;
    this.depots.map((branch, i) => {
      if (branch.branchName === "") {
        isValid = false;
        this.isDepotNameValid = false;
      }
      if (i === this.depots.length - 1) {
        if (isValid) {
          this.isDepotNameValid = true;
        }
      }
    });
  }

  renderMarkers() {
    this.markers = [];
    this.depots.map((depot, index) => {
      this.markers.push({
        lat: depot.coordinate[0],
        lng: depot.coordinate[1],
        label: (index + 1).toString(),
        draggable: true
      });
    });
  }

  onRowSelected() {
    this.map.lat = this.selectedDepot[0].coordinate[0];
    this.map.lng = this.selectedDepot[0].coordinate[1];
  }

  onSave() {
    this.depots = this.temp;
    this.depots.map(function (depot) {
      if (depot._id) {
        this.depotService.updateDepot(depot)
      } else {
        this.depotService.createDepot(depot)
      }
    }.bind(this));
  }

  onDelete(rowIndex: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.depots[rowIndex]._id) {
          this.depotService.deleteDepot(this.depots[rowIndex]._id);
        }
        this.depots.splice(rowIndex, 1);
        this.markers.splice(rowIndex, 1);
        this.temp = [...this.depots];
        this.renderMarkers();
        this.checkBranchName();
      }
    });
  }

  onCancel() {
    this.router.navigate(['/planner']);
  }

  onClear() {
    this.searchElementRef.nativeElement.value = null;
    this.searchElementRef.nativeElement.focus();
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.map.lat = position.coords.latitude;
        this.map.lng = position.coords.longitude;
      });
    }
  }
}
