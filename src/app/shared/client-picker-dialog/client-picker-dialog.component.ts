import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { MapsAPILoader } from '@agm/core';
import { Marker } from '../marker';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Map } from '../map';
import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatInput, MatSnackBar } from '@angular/material';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-picker-dialog',
  templateUrl: './client-picker-dialog.component.html',
  styleUrls: ['./client-picker-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClientPickerDialogComponent implements OnInit, OnDestroy {
  map = new Map();
  searchMarker: Marker;
  marker: Marker;

  header;
  buttonMode;
  isSearched = false;
  phoneNumber: Number;

  clientFormGroup: FormGroup;
  SelectedCoordinateSubject = new Subject<any[]>();
  SelectedCoordinateSubScription: Subscription;

  @ViewChild("search") private searchElementRef: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private mapsAPILoader: MapsAPILoader,
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private dialogRef: MatDialogRef<ClientPickerDialogComponent>,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    if (this.data.client && this.data.client.clientName) {
      this.isSearched = true;
      this.header = 'Edit Client';
      this.buttonMode = 'Edit';

      if (this.data.isNew) {
        this.clientFormGroup = this.formBuilder.group({
          clientName: new FormControl(this.data.client.clientName, Validators.required),
          phoneNumber: new FormControl(this.data.client.phoneNumber, Validators.required),
          address: new FormControl(this.data.client.address, Validators.required),
          coordinate: new FormControl(this.data.client.coordinate, this.checkCoordinateSelected.bind(this))
        });
      } else {
        this.clientFormGroup = this.formBuilder.group({
          clientName: new FormControl(this.data.client.clientName, Validators.required),
          phoneNumber: new FormControl(this.data.client.phoneNumber, Validators.required),
          address: new FormControl(this.data.client.address, Validators.required),
          coordinate: new FormControl(this.data.client.coordinate, this.checkCoordinateSelected.bind(this)),
          demand: new FormControl(this.data.client.demand, Validators.required),
          waitTime: new FormControl(this.data.client.waitTime, Validators.required)
        });
      }

      this.marker = {
        lat: this.data.client.coordinate[0],
        lng: this.data.client.coordinate[1],
        draggable: true
      }
    }
    else {
      this.header = 'Add Client';
      this.buttonMode = 'Add';

      if (this.data.isNew) {
        this.clientFormGroup = this.formBuilder.group({
          clientName: new FormControl(null, Validators.required),
          phoneNumber: new FormControl(null, Validators.required),
          address: new FormControl(null, Validators.required),
          coordinate: new FormControl(null, this.checkCoordinateSelected.bind(this))
        });
      } else {
        this.clientFormGroup = this.formBuilder.group({
          clientName: new FormControl(null, Validators.required),
          phoneNumber: new FormControl(null, Validators.required),
          address: new FormControl(null, Validators.required),
          coordinate: new FormControl(null, this.checkCoordinateSelected.bind(this)),
          demand: new FormControl(null, Validators.required),
          waitTime: new FormControl(null, Validators.required)
        });
      }
    }
    
    this.SelectedCoordinateSubScription = this.SelectedCoordinateSubject.subscribe((value) => {
      this.clientFormGroup.get('coordinate').setValidators(this.checkCoordinateSelected.bind(this));
      this.clientFormGroup.get('coordinate').updateValueAndValidity();
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
          this.map.zoom = 16;
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
  }

  checkCoordinateSelected(control: FormControl): { [s: string]: boolean } {
    if (!this.marker) {
      return { selectedCoordinateError: true };
    } else {
      return null;
    }
  }

  onPhoneNumberSearch() {
    if (this.phoneNumber) {
      this.clientService.getClient(this.phoneNumber).then((client) => {
        this.isSearched = true;
        
        if (client === 'not found') {
          this.header = 'New Client';
          if (this.data.isNew) {
            this.buttonMode = 'Add'
          }
          client = {
            clientName: '',
            address: '',
            coordinate: '',
            phoneNumber: this.phoneNumber
          }
        }
        else {
          if (this.data.isNew) {
            this.header = 'Edit Client';
            this.buttonMode = 'Edit'
          }
          this.marker = {
            lat: client.coordinate[0],
            lng: client.coordinate[1],
            draggable: true
          }
          this.map.lat= client.coordinate[0];
          this.map.lng= client.coordinate[1];
          this.map.zoom = 16;
        }
        
        this.clientFormGroup.controls.clientName.setValue(client.clientName);
        this.clientFormGroup.controls.address.setValue(client.address);
        this.clientFormGroup.controls.phoneNumber.setValue(client.phoneNumber);
        this.clientFormGroup.controls.coordinate.setValue(client.coordinate);
      });
    }
  }

  onMapClicked(event) {
    if (this.isSearched || this.data.isNew) {
      this.marker = {
        lat: event.coords.lat,
        lng: event.coords.lng,
        draggable: true
      };
      this.clientFormGroup.controls.coordinate.setValue([event.coords.lat, event.coords.lng]);
      this.SelectedCoordinateSubject.next([event.coords.lat, event.coords.lng]);
    }
  }

  onDragEnd(event) {
    this.clientFormGroup.controls.coordinate.setValue([event.coords.lat, event.coords.lng]);
  }

  onClientAdded() {
    if (this.clientFormGroup.valid) {
      this.dialogRef.close({
        clientName: this.clientFormGroup.value.clientName,
        phoneNumber: this.clientFormGroup.value.phoneNumber,
        address: this.clientFormGroup.value.address,
        coordinate: this.clientFormGroup.value.coordinate,
        demand: this.clientFormGroup.value.demand,
        waitTime: this.clientFormGroup.value.waitTime
      });
    }
    else {
      this.snackBar.open('Please valid the form', 'close', {
        duration: 2000
      });
    }
  }

  ngOnDestroy() {
    this.SelectedCoordinateSubScription.unsubscribe();
  }
}
