import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { MatButton, MatFormField, MatFormFieldControl, MatInput } from '@angular/material';
import { } from 'googlemaps';

import { ClientService } from '../../../services/client.service';
import { Marker } from '../../../shared/marker';

import { Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.css']
})
export class CreateClientComponent implements OnInit {
  [x: string]: any;
  searchControl: FormControl;
  isNew: boolean = false;
  address;
  zoom;
  lat;
  lng;

  animal: string;
  name: string;


  editForm: FormGroup;

  client: any = {
    companyName: '',
    branches: []
  };

  markers: Marker[] = [];
  temp = [];
  selected = [];
  editing = {};


  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { } 

  ngOnInit() {
    const branchMarkers: Marker[] = [];
    const companyId = this.activatedRoute.snapshot.queryParams.companyId;
    if (companyId) {
      this.clientService.getClient(companyId).then((response) => {
        this.client = response;
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
      branchNameInput: new FormControl(null, Validators.required)

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

          this.client.branches.push({
            coordinate: [this.lat, this.lng]
          });

          const lastIndex = this.client.branches.length - 1;
          this.client.branches[lastIndex].branchName = this.searchElementRef.nativeElement.value;
          this.editing[lastIndex + '-branchName'] = true;
          this.temp = [...this.client.branches];
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
    this.client.branches.push({
      coordinate: [latitude, longtitude]
    });
    const lastIndex = this.client.branches.length - 1;
    this.client.branches[lastIndex].branchName = "New branch";
    this.editing[lastIndex + '-branchName'] = true;
    this.temp = [...this.client.branches];
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
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

    // update the rows
    this.client.branches = temp;
  }

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.client.branches[rowIndex][cell] = event.target.value;
    this.client.branches = [...this.client.branches];
  }

  onRowSelected() {
    this.lat = this.selected[0].coordinate[0];
    this.lng = this.selected[0].coordinate[1];
    this.zoom = 15;
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
  onClick() {
    this.modal.alert()
        .size('lg')
        .showClose(true)
        .title('A simple Alert style modal window')
        .body(`
            <h4>Alert is a classic (title/body/footer) 1 button modal window that 
            does not block.</h4>
            <b>Configuration:</b>
            <ul>
                <li>Non blocking (click anywhere outside to dismiss)</li>
                <li>Size large</li>
                <li>Dismissed with default keyboard key (ESC)</li>
                <li>Close wth button click</li>
                <li>HTML content</li>
            </ul>`)
        .open();
  }

  // onEdit(){
  //   const control = new FormControl(null, Validators.required);
  //   (<FormArray>this.editForm.get('branchNameInput')).push(Control);

  // }

  openDialog(): void {
    let dialogRef = this.dialog.open(CreateClientComponent, {
      width: '250px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


