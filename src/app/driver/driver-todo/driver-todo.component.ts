import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ResultService } from './../../services/result.service';

@Component({
  selector: 'app-driver-todo',
  templateUrl: './driver-todo.component.html',
  styleUrls: ['./driver-todo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DriverTodoComponent implements OnInit {
  @ViewChild('todoTable') todoTable: any;
  @ViewChild('doneTable') doneTable: any;
  todoExpanded: any = {};
  doneExpanded: any = {};
  todo = [];
  selectedTodo = [];
  done = [];
  licenseNo: string;
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
    this.licenseNo = JSON.stringify(JSON.parse(localStorage.getItem('currentUser')).licenseNo).replace(/\"/g, '');
    this.resultService.getResults().then((response) => {
      response.forEach((result) => {
        result.vehicles.forEach((vehicle) => {
          if (vehicle.driver.licenseNo === this.licenseNo) {
            if (vehicle.isCompleted) {
              this.done.push({
                date: result.date,
                time: new Date(result.dateTime).toTimeString().split(" ")[0].slice(0, 5),
                depot: result.depot.depotName,
                id: result._id
              });
            } else {
              this.todo.push({
                date: result.date,
                time: new Date(result.dateTime).toTimeString().split(" ")[0].slice(0, 5),
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

  onDriverSelected({ selected }) {
    const id = selected[0] ? selected[0].id : null;
    var rowIndex = this.todo.findIndex(function (todo) {
      return todo === selected[selected.length - 1];
    });
    if (id) {
      this.resultService.updateDriverDone(id, this.licenseNo).then((res) => {
        this.selectedTodo = [];
        var completedItem = this.todo.splice(rowIndex, 1);
        this.done.push(completedItem[0]);
      });
    }
  }

  toggleExpandDoing(row) {
    this.todoTable.rowDetail.toggleExpandRow(row);
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
