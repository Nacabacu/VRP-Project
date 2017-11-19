import { Component, OnInit,  } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';

import { Marker } from '../../shared/marker';
import { Map } from '../../shared/map';
import { Client } from '../../shared/client';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  clients: Client[];
  tempCleint = [];
  selectedClients = [];

  map = new Map();
  markers: Marker[] = [];

  constructor(private clientService: ClientService) { }

  ngOnInit() {
    this.clientService.getAllClients().then((response) => {
      this.clients = response;
      this.tempCleint = [...this.clients];
      this.renderMarkers();
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempCleint.filter((data) => {
      return data.telNum.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.clients = temp;
  }

  renderMarkers() {
    this.markers = [];
    this.clients.map((client, index) => {
      this.markers.push({
        lat: client.coordinate[0],
        lng: client.coordinate[1],
        label: (index + 1).toString()
      });
    });
  }

  onClientSelected(event) {
    this.map.lat = this.selectedClients[0].coordinate[0];
    this.map.lng = this.selectedClients[0].coordinate[1];
    this.map.zoom = 15;
  }
}
