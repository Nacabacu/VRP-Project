import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';

import { ClientService } from '../../services/client.service';
import { Marker } from '../../shared/marker';
import { Client } from '../../shared/client';
import { Map } from '../../shared/map';

import { ClientPickerDialogComponent } from '../../shared/client-picker-dialog/client-picker-dialog.component';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';

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

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog
  ) { }

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

  onNewClient() {
    const addDialog = this.dialog.open(ClientPickerDialogComponent, {
      width: '80vw',
      data: {
        isNew: true
      }
    });

    addDialog.afterClosed().subscribe((result) => {
      if (result) {
        var existClient = false;
        for (var i = 0; i < this.clients.length; i++) {
          if (this.clients[i].phoneNumber === result.phoneNumber) {
            this.clients[i] = result;
            existClient = true;
            break;
          }
        }
        if (!existClient) {
          this.clients.push(result);
          this.markers.push({
            lat: result.coordinate[0],
            lng: result.coordinate[1],
            label: (this.clients.length).toString()
          });
        }
        this.tempClients = this.clients;
        this.clientService.updateClient(result);
      }
    });
  }

  editClient(index) {
    const editDialog = this.dialog.open(ClientPickerDialogComponent, {
      width: '80vw',
      data: {
        client: this.clients[index],
        isNew: true
      }
    });

    editDialog.afterClosed().subscribe((result) => {
      if (result) {
        for (var i = 0; i < this.clients.length; i++) {
          if (this.clients[i].phoneNumber === result.phoneNumber) {
            this.clients[i] = result;
            break;
          }
        }
        this.tempClients = this.clients;
        this.clientService.updateClient(result);
      }
    });
  }

  deleteClient(index) {
    const removeDialog = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      data: {
        action: 'Delete',
        item: 'client'
      }
    });

    removeDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.clientService.deleteClient(this.clients[index].phoneNumber);
        this.clients.splice(index, 1);
        this.markers.splice(index, 1);
        this.tempClients = this.clients;
      }
    });
  }
}
