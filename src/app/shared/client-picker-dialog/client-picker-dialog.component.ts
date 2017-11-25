import { MapsAPILoader } from '@agm/core';
import { Marker } from '../marker';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Map } from '../map';
import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-picker-dialog',
  templateUrl: './client-picker-dialog.component.html',
  styleUrls: ['./client-picker-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClientPickerDialogComponent implements OnInit {
  map = new Map();
  searchMarker: Marker;
  marker: Marker;

  header;
  searched = false;
  telNum: Number;
  clientFormGroup: FormGroup;

  @ViewChild("search") private searchElementRef: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private mapsAPILoader: MapsAPILoader,
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private dialogRef: MatDialogRef<ClientPickerDialogComponent>
  ) { }

  ngOnInit() {
    this.header = 'Add Client';

    this.clientFormGroup = this.formBuilder.group({
      clientName: new FormControl(null, Validators.required),
      telNum: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      demand: new FormControl(null, Validators.required),
      waitTime: new FormControl(null, Validators.required)
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
            draggable: true
          };
        });
      });
    });
  }

  onTelNumSearch() {
    if (this.telNum) {
      this.clientService.getClient(this.telNum).then((client) => {
        if (client === 'not found') {
          this.header = 'New Client';
          this.searched = true;
        }
        else {
          this.header = 'Found Client';
          this.searched = true;
        }
      });
    }
  }
}
