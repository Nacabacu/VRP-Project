import { ResultService } from './../../services/result.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-planner-todo',
  templateUrl: './planner-todo.component.html',
  styleUrls: ['./planner-todo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlannerTodoComponent implements OnInit {
  doing = [];
  done = [];

  constructor(
    private resultService: ResultService
  ) { }

  ngOnInit() {
    this.resultService.getResults().then((response) => {
      response.results.forEach((result) => {
        let isFinished = true;
        console.log()
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
    this.resultService.getResult(id).then(res => console.log(res))
  }

}
