import { ClientService } from '../../../services/client.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-client-picker-dialog',
  templateUrl: './client-picker-dialog.component.html',
  styleUrls: ['./client-picker-dialog.component.css']
})
export class ClientPickerDialogComponent implements OnInit {
  tempClients = [];
  clients = [];
  selectedClient = [];
  capacity = 0;
  hour = 0;
  minute = 0;

  constructor(
    private clientService: ClientService,
    public dialogRef: MatDialogRef<ClientPickerDialogComponent>
  ) { }

  ngOnInit() {
    this.clientService.getAllClients().then((response) => {
      response.map((client) => {
        client.branches.map((branch) => {
          const rowClient: any = {};
          rowClient.companyName = client.companyName;
          rowClient.branchName = branch.branchName;
          rowClient.coords = branch.coordinate;
          this.clients.push(rowClient);
        });
      });
      this.tempClients = [...this.clients];
    });
  }

  onConfirm() {
    const result = {
      companyName: this.selectedClient[0].companyName,
      branchName: this.selectedClient[0].branchName,
      capacity: this.capacity,
      time: this.hour + ":" + this.minute
    }
    this.dialogRef.close(result);
  }
}
