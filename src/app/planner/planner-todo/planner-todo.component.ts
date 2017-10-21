import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-planner-todo',
  templateUrl: './planner-todo.component.html',
  styleUrls: ['./planner-todo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlannerTodoComponent implements OnInit {
  rows = [
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' },
    { date: '10/6/2017', time: '06:00', depot: 'Bangkapi 1' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
