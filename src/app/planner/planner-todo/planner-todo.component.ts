import { ResultService } from './../../services/result.service';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

@Component({
  selector: 'app-planner-todo',
  templateUrl: './planner-todo.component.html',
  styleUrls: ['./planner-todo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlannerTodoComponent implements OnInit {
  @ViewChild('doingTable') doingTable: any;
  @ViewChild('doneTable') doneTable: any;
  doingExpanded: any = {};
  doneExpanded: any = {};
  doing = [];
  done = [];
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
    this.resultService.getResults().then((response) => {
      response.results.forEach((result) => {
        let isFinished = true;
        result.vehicles.forEach((vehicle) => {
          if (!vehicle.isCompleted) {
            isFinished = false;
          }
        });
        if (isFinished) {
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
      });
    });
  }

  onEdit(id: string) {
    this.resultService.getResult(id).then(res => console.log(res));
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
