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
  private sub: any;
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
  constructor(private activatedRoute: ActivatedRoute, private clientService: ClientService) { }

  ngOnInit() {
    // subscribe to router event
    this.sub = this.activatedRoute.params.subscribe((params) => {
      var clientData = this.clientService.getClient(params['companyNumber']);
      if (clientData) {
        const branchMarkers: Marker[] = [];
        this.client = clientData;
        this.client.branches.map(function (branch) {
          const branchMarker: Marker = {
            lat: 0,
            lng: 0,
            draggable: true
          };
          branchMarker['lat'] = branch.coordinate[0];
          branchMarker['lng'] = branch.coordinate[1];
          branchMarker['lable'] = branch.branchName;
          branchMarker['draggable'] = false;
          branchMarkers.push(branchMarker);
        });
        this.markers = branchMarkers;
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
