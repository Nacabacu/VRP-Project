import { Component, OnInit } from '@angular/core';

import { ClientService } from '../../services/client.service';
import { Marker } from '../../shared/marker';
import { Client } from '../../shared/client';
import { Map } from '../../shared/map';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  clients: Client[];
  tempClients = [];
  selectedClients = [];

  map = new Map();
  markers: Marker[] = [];

  constructor(private clientService: ClientService) { }

  ngOnInit() {
    this.clientService.getAllClients().then((response) => {
      this.clients = response;
      this.tempClients = [...this.clients];
      this.renderMarkers();
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempClients.filter((data) => {
      return data.clientName.toLowerCase().indexOf(val) !== -1 || data.phoneNumber.toLowerCase().indexOf(val) !== -1 || !val;
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
