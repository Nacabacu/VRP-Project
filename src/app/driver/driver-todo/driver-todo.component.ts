import { ResultService } from './../../services/result.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-driver-todo',
  templateUrl: './driver-todo.component.html',
  styleUrls: ['./driver-todo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DriverTodoComponent implements OnInit {
  doing = [];
  done = [];
  licenseId: string;

  constructor(
    private resultService: ResultService
  ) { }

  ngOnInit() {
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

  onEdit(id: string) {
    this.resultService.getResult(id).then(res => console.log(res))
  }

}
