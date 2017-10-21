import { Marker } from '../../../marker';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButton, MatFormField, MatFormFieldControl, MatInput } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { Client } from '../../../client';
import { ClientService } from '../../../shared/service/client.service';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.css']
})
export class CreateClientComponent implements OnInit, OnDestroy {
  lat = 13.7563;
  lng = 100.5018;
  zoom = 11;
  markers: Marker[] = [
    {
      lat: 14,
      lng: 100,
      label: 'A',
      draggable: false
    },
    {
      lat: 13,
      lng: 99.7,
      label: 'B',
      draggable: false
    }
  ];

  client: any = {
    companyName: '',
    companyNumber: 0,
    branches: []
  };

  rows = [];

  temp = [];

  columns = [
    { prop: 'branchName' },
    { prop: 'coordinate' }
  ];

  private sub: any;

  constructor(private activatedRoute: ActivatedRoute, private clientService: ClientService) { }

  mapClicked($event) {
    console.log($event);
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  ngOnInit() {
    // subscribe to router event
    this.sub = this.activatedRoute.queryParams.subscribe((queryParams) => {
      const clientData = this.clientService.getClient(queryParams.companyNumber);
      if (clientData) {
        const branchMarkers: Marker[] = [];
        const data = [];
        this.client = clientData;
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
          branchMarker.draggable = false;
          branchMarkers.push(branchMarker);
        });
        this.markers = branchMarkers;
      }
    });
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
