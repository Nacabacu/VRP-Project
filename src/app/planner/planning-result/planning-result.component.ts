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
  id: number;
  result = new Result();
  selectedResult = [];
  selectedClient = [];
  showAll = true;
  subRoute = false;
  selectedRouteInfo = [];
  routeInfo = [];
  waitTime = [];
  currentTab;

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
          this.waitTime.push(client.waitTime);
        });
        this.result.vehicles.forEach((vehicle, index) => {
          vehicle.color = this.colors[index];
        });

        this.result.vehicles.forEach((vehicle, vehiclesIndex) => {
          this.routeInfo.push(new Array());

          var startTime = new Date(this.result.dateTime);
          var departures = [];
          var arrivals = [];
          var subDirections = [];
          var demands = [];
          subDirections.push('D 🡒 ' + vehicle.route[0]);
          departures.push(startTime);
          arrivals.push(new Date(startTime.getTime() + this.result.times[0][vehicle.route[0]] * 1000));

          vehicle.route.forEach((node, routeIndex) => {
            // departure & arrival
            var departure = new Date(arrivals[routeIndex].getTime() + this.waitTime[routeIndex] * 1000);
            if (routeIndex === vehicle.route.length - 1) {
              var arrival = new Date(departure.getTime() + this.result.times[node][vehicle.route[0]] * 1000);
            }
            else {
              var arrival = new Date(departure.getTime() + this.result.times[node][vehicle.route[routeIndex + 1]] * 1000);
            }
            departures.push(departure);
            arrivals.push(arrival);

            // demands
            demands.push(this.result.clients[node - 1].demand);

            // route
            if (routeIndex !== vehicle.route.length - 1) {
              subDirections.push(node + ' 🡒 ' + vehicle.route[routeIndex + 1]);
            }
            else {
              subDirections.push(node + ' 🡒 D');
            }
          });

          subDirections.forEach((subDirection, subDirectionIndex) => {
            this.routeInfo[vehiclesIndex].push({
              route: subDirection,
              departure: departures[subDirectionIndex].toLocaleTimeString('th-TH').substring(0, 5),
              arrival: arrivals[subDirectionIndex].toLocaleTimeString('th-TH').substring(0, 5),
              demand: subDirectionIndex === subDirections.length - 1 ? 0 : demands[subDirectionIndex]
            });
          })
        });

        console.log(this.result)
      })
      .catch((err) => {
        this.router.navigate(['/not-found']);
      });
  }

  onSubRouteSelected(e) {
    this.subRoute = true;
    this.resultService.sendClearMap();
    var node = e.selected[0].route.split(' ');
    this.selectedResult = [];
    this.selectedResult.push({
      route: node,
      color: this.colors[this.currentTab - 1]
    });
  }

  clearSelectedRouteInfo() {
    if (this.selectedRouteInfo.length !== 0) {
      this.subRoute = false;
      this.selectedRouteInfo = [];
      this.onChangedTab({ index: this.currentTab });
    }
  }

  onChangedTab(e) {
    this.selectedRouteInfo = [];
    this.currentTab = e.index;
    this.subRoute = false;

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
