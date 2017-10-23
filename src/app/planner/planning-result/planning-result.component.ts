import { Result } from './../../models/result';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { ResultService } from './../../services/result.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-planning-result',
  templateUrl: './planning-result.component.html',
  styleUrls: ['./planning-result.component.css']
})
export class PlanningResultComponent implements OnInit {
  id: number;
  result = new Result();

  constructor(
    private resultService: ResultService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe((param) => {
      this.id = param['id'];
    });
  }

  ngOnInit() {
    this.resultService.getResult(this.id)
      .then((response) => {
        this.result = response;
      })
      .catch((err) => {
        this.router.navigate(['/not-found']);
      });
  }

}
