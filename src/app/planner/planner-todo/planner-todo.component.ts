import { Router, ActivatedRoute } from '@angular/router';
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
    private resultService: ResultService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.onResize({
      target: {
        innerWidth: window.innerWidth
      }
    });
    this.resultService.getResults().then((response) => {
      response.forEach((result) => {
        if (result.isAllCompleted) {
          this.done.push({
            date: result.date,
            time: result.time,
            depot: result.depot.depotName,
            id: result._id
          });
        } else {
          this.doing.push({
            date: result.date,
            time: result.time,
            depot: result.depot.depotName,
            id: result._id
          });
        }
      });
    });
  }

  onEdit(id: string) {
    this.resultService.getResult(id).then((res) => {
      this.router.navigate(['./planning', id], {relativeTo: this.route})
    });
  }

  onView(id: string) {
    this.router.navigate(['./result', id], { relativeTo: this.route });
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

  sortByDate(firstDate, secondDate) {
    firstDate = firstDate.split("/");
    secondDate = secondDate.split("/");
    const formattedFirstDate = new Date(firstDate[2], firstDate[1] - 1, firstDate[0]);
    const formattedSecondDate = new Date(secondDate[2], secondDate[1] - 1, secondDate[0]);

    if (formattedFirstDate < formattedSecondDate) {
      return -1;
    } else if (formattedFirstDate > formattedSecondDate) {
      return 1;
    } else {
      return 0;
    }
  }

}
