import { Subject } from 'rxjs/Subject';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { Result } from './../../models/result';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultService } from './../../services/result.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-driving-result',
  templateUrl: './driving-result.component.html',
  styleUrls: ['./driving-result.component.css']
})
export class DrivingResultComponent implements OnInit {
  licenseNo;
  colors = ['blue', 'yellow', 'lime', 'red', 'green', 'purple', 'maroon', 'navy', 'olive', 'fuchsia'];
  id: number;
  result = new Result();
  selectedResult = [];
  selectedClient = [];
  subRoute = false;
  selectedRouteInfo = [];
  routeInfo = [];
  clients = [];
  waitTime = [];
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
    this.licenseNo = JSON.stringify(JSON.parse(localStorage.getItem('currentUser')).licenseNo).replace(/\"/g, '');

    this.resultService.getResult(this.id)
      .then((response) => {
        this.result = response;
        this.result.clients.forEach((client, index) => {
          client.index = index + 1;
          this.waitTime.push(client.waitTime);
        });

        var vehiclesTemp = this.result.vehicles
        this.result.vehicles = [];
        vehiclesTemp.forEach((vehicle, index) => {
          if (vehicle.driver.licenseNo === this.licenseNo) {
            this.result.vehicles.push(vehicle);
            this.result.vehicles[0].color = 'blue';
          }
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
        this.refreshMap();
      })
      .catch((err) => {
        this.router.navigate(['/not-found']);
      });
  }

  refreshMap() {
    this.selectedRouteInfo = [];
    this.subRoute = false;

    this.resultService.sendClearMap();
    this.selectedResult = [];
    this.selectedResult.push(this.result.vehicles[0]);

    this.selectedClient = [];
    this.selectedResult[0].route.forEach((clientNumber) => {
      this.selectedClient.push(this.result.clients[clientNumber - 1]);
    });
  }

  onOpenedExpansionPanel(data) {
    this.subRouteStartNode = data.startNode;
    this.subRoute = true;
    this.resultService.sendClearMap();
    this.selectedResult = [];
    this.selectedResult.push({
      route: [data.startNode, data.endNode],
      color: 'blue'
    });
  }

  onClosedExpansionPanel(data) {
    if (this.subRouteStartNode === data.startNode) {
      this.refreshMap();
    }
  }

  onCompleteButton() {
    const id = this.result._id;
    if (id) {
      this.resultService.updateDriverDone(id, this.licenseNo).then((res) => {
        this.router.navigate(['/driver']);
      });
    }
  }
}
