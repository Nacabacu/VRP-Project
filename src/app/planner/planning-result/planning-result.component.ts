import { Subject } from 'rxjs/Subject';
import { GoogleMapsAPIWrapper } from '@agm/core';
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
  colors = ['blue', 'yellow', 'lime', 'red', 'green', 'purple', 'maroon', 'navy', 'olive', 'fuchsia'];
  depotMarker = "../../assets/depot_marker.png";
  id: number;
  result = new Result();
  selectedResult = [];
  selectedClient = [];
  showAll = true;

  constructor(
    private resultService: ResultService,
    private route: ActivatedRoute,
    private router: Router,
    private gmapsApi: GoogleMapsAPIWrapper
  ) {
    this.route.params.subscribe((param) => {
      this.id = param['id'];
    });
  }

  ngOnInit() {
    this.resultService.getResult(this.id)
      .then((response) => {
        this.result = response;
        this.result.clients.forEach((client, index) => {
          client.index = index + 1;
        });
        this.result.vehicles.forEach((vehicle, index) => {
          vehicle.color = this.colors[index];
        })

        console.log(this.result)
      })
      .catch((err) => {
        this.router.navigate(['/not-found']);
      });
  }

  onChangedTab(e) {
    if (e.index === 0) {
      this.showAll = true;
    } else {
      this.resultService.sendClearMap();
      this.selectedResult = [];
      this.selectedResult.push(this.result.vehicles[e.index - 1]);

      this.selectedClient = [];
      this.selectedResult[0].route.forEach((clientNumber) => {
        this.selectedClient.push(this.result.clients[clientNumber - 1]);
      });
      this.showAll = false;
    }
  }

}
