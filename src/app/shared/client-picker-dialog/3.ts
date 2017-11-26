import { MapsAPILoader } from '@agm/core';
import { Marker } from '../marker';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Map } from '../map';
import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-picker-dialog',
  templateUrl: './client-picker-dialog.component.html',
  styleUrls: ['./client-picker-dialog.component.css']
})
export class ClientPickerDialogComponent implements OnInit {
  isView: boolean = false;
  isSearched: boolean = false;
  clientFound: boolean = false;
  map = new Map();
  marker: Marker;
  clientFormGroup: FormGroup;

  @ViewChild("telNumInput") private telNumInputElementRef: ElementRef;
  @ViewChild("search") private searchElementRef: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private mapsAPILoader: MapsAPILoader,
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private dialogRef: MatDialogRef<ClientPickerDialogComponent>
  ) {
    console.log(data)
    if (data.telNum) {
      this.isSearched = true;
      this.clientFound = true;
      this.isView = true;
      this.marker = {
        lat: data.coordinate[0],
        lng: data.coordinate[1],
        draggable: false
      }
      this.map = {
        zoom: 15,
        lat: data.coordinate[0],
        lng: data.coordinate[1],
      };
    }
    this.clientFormGroup = this.formBuilder.group({
      clientName: new FormControl(data.clientName || null, [Validators.required]),
      address: new FormControl(data.address || null, [Validators.required]),
      telNum: new FormControl(data.telNum || null, [Validators.required]),
      coordinate: new FormControl(data.coordinate || null, [Validators.required])
    });
   }

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
          this.map.zoom = 16;
          this.map.lat = place.geometry.location.lat();
          this.map.lng = place.geometry.location.lng();
          
          this.marker = {
            lat: this.map.lat,
            lng: this.map.lng,
            draggable: true
          };
        });
      });
    });
  }

  onSearch() {
    this.clientService.getClient(this.telNumInputElementRef.nativeElement.value).then((client) => {
      this.isSearched = true;
      if (client.length === 1) {
        this.clientFound = true;
        this.clientFormGroup.controls.clientName.setValue(client[0].clientName);
        this.clientFormGroup.controls.address.setValue(client[0].address);
        this.clientFormGroup.controls.telNum.setValue(client[0].telNum);
        this.clientFormGroup.controls.coordinate.setValue(client[0].coordinate);
        this.marker = {
          lat: client[0].coordinate[0],
          lng: client[0].coordinate[1],
          draggable: false
        };
        this.map = {
          zoom: 15,
          lat: client[0].coordinate[0],
          lng: client[0].coordinate[1],
        };
      }
      else {
        this.clientFound = false;
        this.clientFormGroup.controls.clientName.setValue('');
        this.clientFormGroup.controls.address.setValue('');
        this.clientFormGroup.controls.telNum.setValue(this.telNumInputElementRef.nativeElement.value);
        this.clientFormGroup.controls.coordinate.setValue('');
        this.marker = {
          lat: this.map.lat,
          lng: this.map.lng,
          draggable: true
        };
      }
      this.telNumInputElementRef.nativeElement.value = null;
    });
  }

  onDragEnd(event) {
    this.clientFormGroup.controls.coordinate.setValue([event.coords.lat, event.coords.lng]);
  }

  onMapClicked(event) {
    if (!this.clientFound && this.isSearched) {
      this.marker= {
        lat: event.coords.lat,
        lng: event.coords.lng,
        draggable: true
      };
      this.clientFormGroup.controls.coordinate.setValue([event.coords.lat, event.coords.lng]);
    }
  }

  onConfirm() {
    const result = {
      clientName: this.clientFormGroup.controls.clientName.value,
      telNum: this.clientFormGroup.controls.telNum.value,
      address: this.clientFormGroup.controls.address.value,
      coordinate: this.clientFormGroup.controls.coordinate.value
    }
    this.dialogRef.close(result);
  }
}
