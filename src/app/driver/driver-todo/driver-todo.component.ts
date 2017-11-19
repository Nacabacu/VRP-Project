import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ResultService } from './../../services/result.service';

@Component({
  selector: 'app-driver-todo',
  templateUrl: './driver-todo.component.html',
  styleUrls: ['./driver-todo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DriverTodoComponent implements OnInit {
  @ViewChild('doingTable') doingTable: any;
  @ViewChild('doneTable') doneTable: any;
  doingExpanded: any = {};
  doneExpanded: any = {};
  todoDriver = [];
  done = [];
  licenseId: string;
  isResponsive: boolean;

  constructor(
    private resultService: ResultService,
    private router: Router
  ) { }

  ngOnInit() {
    this.onResize({
      target: {
        innerWidth: window.innerWidth
      }
    });
    this.licenseId = JSON.stringify(JSON.parse(localStorage.getItem('currentUser')).licenseId).replace(/\"/g, '');
    this.resultService.getResults().then((response) => {
      response.forEach((result) => {
        result.vehicles.forEach((vehicle) => {
          if (vehicle.driver.licenseNo === this.licenseId) {
            if (vehicle.isCompleted) {
              this.done.push({
                date: result.date,
                time: new Date(result.dateTime).toTimeString().split(" ")[0],
                depot: result.depot.depotName,
                id: result._id
              });
            } else {
              this.todoDriver.push({
                date: result.date,
                time: new Date(result.dateTime).toTimeString().split(" ")[0],
                depot: result.depot.depotName,
                id: result._id
              });
            }
          }
        });
      });
    });
  }

  onView(id: string) {
    this.router.navigate(['/driver/result', id]);
  }

  toggleExpandDoing(row) {
    this.doingTable.rowDetail.toggleExpandRow(row);
  }

  toggleExpandDone(row) {
    this.doneTable.rowDetail.toggleExpandRow(row);
  }

  onResize(e) {
    if (e.target.innerWidth <= 768) {
      this.isResponsive = true;
    } else {
      this.isResponsive = false;
    }
  }

}
