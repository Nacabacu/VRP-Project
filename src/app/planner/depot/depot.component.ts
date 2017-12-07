import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';

import { DepotService } from './../../services/depot.service';

import { Marker } from '../../shared/marker';
import { Map } from '../../shared/map';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-depot',
  templateUrl: './depot.component.html',
  styleUrls: ['./depot.component.css']
})
export class DepotComponent implements OnInit {
  markers: Marker[] = [];
  map = new Map();

  depots: any[];
  tempDepot: any[];
  selectedDepot = [];
  editing = {};

  isDepotNameValid: boolean = true;

  searchLocationInput;
  filterDepotInput;
  @ViewChild("searchMap") public searchElementRef: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private depotService: DepotService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.depotService.getAllDepots().then((response) => {
      this.depots = response;
      this.tempDepot = [...this.depots];
      this.renderMarkers();
    });

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
    this.tempDepot = [...this.depots];
    this.isDepotNameValid = false;
  }

  markerDragEnd(marker: Marker, event, index: number) {
    this.depots[index].coordinate = [event.coords.lat, event.coords.lng];
    this.depots = [...this.depots];
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempDepot.filter((data) => {
      return data.depotName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.depots = temp;
  }

  updateValue(event, rowIndex) {
    this.depots[rowIndex]['depotName'] = event.target.value;
    if (event.target.value !== "") {
      this.editing[rowIndex + '-depotName'] = false;
      this.depots = [...this.depots];
    }
    this.checkBranchName();
  }

  checkBranchName() {
    for (let index = 0; index < this.depots.length; index++) {
      if (this.depots[index].depotName === "") {
        this.isDepotNameValid = false;
        break;
      }
      else {
        this.isDepotNameValid = true;
      }
    }
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
    this.depots = this.tempDepot;
    this.depotService.updateDepot(this.depots).then((response) => {
      this.snackBar.open('Update depot successfully', 'close', {
        duration: 2000,
      });
    });
  }

  onDelete(rowIndex: number, rowData) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      data: {
        action: 'Delete',
        item: 'depot'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (rowData._id) {
          this.depotService.deleteDepot(rowData._id)
        }
        this.depots.splice(rowIndex, 1);
        this.markers.splice(rowIndex, 1);
        this.tempDepot = [...this.depots];
        this.renderMarkers();
        this.checkBranchName();
        this.snackBar.open('Delete depot successfully', 'close', {
          duration: 2000,
        });
      }
    });
  }
}
