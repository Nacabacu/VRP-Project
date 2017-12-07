import { Subject } from 'rxjs/Subject';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { Result } from './../../models/result';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultService } from './../../services/result.service';
import { Component, OnInit, ViewChild } from '@angular/core';

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
  clients = [];
  waitTime = [];
  currentTab;
  selectedTabIndex;
  subRouteStartNode;
  @ViewChild('driverTable') todoTable: any;

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

        this.clients = this.result.clients;

        this.result.vehicles.forEach((vehicle, vehiclesIndex) => {
          this.routeInfo.push(new Array());

          var startTime = new Date(this.result.dateTime);
          var departures = [];
          var arrivals = [];
          var startNodes = [];
          var endNodes = [];
          var demands = [];
          var waitTimes = [];
          
          startNodes.push('D')
          endNodes.push(vehicle.route[0])
          departures.push(startTime);
          arrivals.push(new Date(startTime.getTime() + this.result.times[0][vehicle.route[0]] * 1000));

          vehicle.route.forEach((node, routeIndex) => {
            var waitTime = this.result.clients[node - 1].waitTime;

            if (vehicle.route.length === 1) {
              var departure = new Date(arrivals[routeIndex].getTime() + this.waitTime[routeIndex] * 1000 + waitTime * 60 * 1000);
              var arrival = new Date(departure.getTime() + this.result.times[0][vehicle.route[0]] * 1000);
              departures.push(departure);
              arrivals.push(arrival);
            } else {
              // departure & arrival
              var departure = new Date(arrivals[routeIndex].getTime() + this.waitTime[routeIndex] * 1000 + waitTime * 60 * 1000);
              if (routeIndex === vehicle.route.length - 1) {
                var arrival = new Date(departure.getTime() + this.result.times[node][vehicle.route[0]] * 1000);
              }
              else {
                var arrival = new Date(departure.getTime() + this.result.times[node][vehicle.route[routeIndex + 1]] * 1000);
              }
              departures.push(departure);
              arrivals.push(arrival);
            }
            
            waitTimes.push(waitTime);

            // demands
            demands.push(this.result.clients[node - 1].demand);

            // route
            if (routeIndex !== vehicle.route.length - 1) {
              startNodes.push(node);
              endNodes.push(vehicle.route[routeIndex + 1]);
            }
            else {
              startNodes.push(node);
              endNodes.push('D');
            }
          });

          startNodes.forEach((startNode, subDirectionIndex) => {
            this.routeInfo[vehiclesIndex].push({
              startNode: startNode,
              endNode: endNodes[subDirectionIndex],
              departure: departures[subDirectionIndex].toLocaleTimeString('th-TH').substring(0, 5),
              arrival: arrivals[subDirectionIndex].toLocaleTimeString('th-TH').substring(0, 5),
              demand: demands[subDirectionIndex],
              waitTime: waitTimes[subDirectionIndex]
            });
          })
        });

      })
      .catch((err) => {
        this.router.navigate(['/not-found']);
      });
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
      this.selectedResult.push(this.result.vehicles[this.currentTab - 1]);

      this.selectedClient = [];
      this.selectedResult[0].route.forEach((clientNumber) => {
        this.selectedClient.push(this.result.clients[clientNumber - 1]);
      });
      this.showAll = false;
    }
  }

  onOpenedExpansionPanel(data) {
    this.subRouteStartNode = data.startNode;
    this.subRoute = true;
    this.resultService.sendClearMap();
    this.selectedResult = [];
    this.selectedResult.push({
      route: [data.startNode, data.endNode],
      color: this.colors[this.currentTab - 1]
    });
  }

  onClosedExpansionPanel(data) {
    if (this.subRouteStartNode === data.startNode) {
      this.onChangedTab({ index: this.currentTab });
    }
  }
}
