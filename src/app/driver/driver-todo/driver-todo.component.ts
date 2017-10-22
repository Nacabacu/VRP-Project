import { ResultService } from './../../services/result.service';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

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
  doing = [];
  done = [];
  licenseId: string;
  isResponsive: boolean;

  constructor(
    private resultService: ResultService
  ) { }

  ngOnInit() {
    this.onResize({
      target: {
        innerWidth: window.innerWidth
      }
    });
    this.licenseId = JSON.stringify(JSON.parse(localStorage.getItem('currentUser')).licenseId).replace(/\"/g, '');
    this.resultService.getResults().then((response) => {
      response.results.forEach((result) => {
        result.vehicles.forEach((vehicle) => {
          if (vehicle.driver.licenseId === this.licenseId) {
            if (vehicle.isCompleted) {
              this.done.push({
                date: result.date.replace(/T.+/g, ''),
                time: /T(.+)\./g.exec(result.date)[1],
                depot: result.depot.depotName,
                id: result._id
              });
            } else {
              this.doing.push({
                date: result.date.replace(/T.+/g, ''),
                time: /T(.+)\./g.exec(result.date)[1],
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
    this.resultService.getResult(id).then(res => console.log(res));
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
