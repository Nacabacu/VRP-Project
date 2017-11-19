import { GoogleMapsAPIWrapper } from '@agm/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ResultService } from '../../services/result.service';
import { Result } from '../../models/result';

@Component({
  selector: 'app-driving-result',
  templateUrl: './driving-result.component.html',
  styleUrls: ['./driving-result.component.css']
})
export class DrivingResultComponent implements OnInit {
  depotMarker = "../../assets/depot_marker.png";
  id: number;
  result = new Result();
  selectedResult = [];
  selectedClient = [];
  subRoute = false;
  selectedRouteInfo = [];
  routeInfo = [];
  waitTime = [];
  currentTab;
  licenseId: string;
  driver: any = {};
  loadWeight: number;

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
    this.licenseId = JSON.stringify(JSON.parse(localStorage.getItem('currentUser')).licenseId).replace(/\"/g, '');
    this.resultService.getResult(this.id)
      .then((response) => {
        this.result = response;
        this.result.clients.forEach((client, index) => {
          client.index = index + 1;
          this.waitTime.push(client.waitTime);
        });
        this.result.vehicles.forEach((vehicle, index) => {
          vehicle.color = 'blue';
        });
        this.result.vehicles.forEach((vehicle, vehiclesIndex) => {
          if (vehicle.driver.licenseNo === this.licenseId) {
            this.driver.name = vehicle.driver.name;
            this.driver.licenseNo = vehicle.driver.licenseNo;
            this.driver.vehicleNo = vehicle.driver.vehicleNo;
            this.loadWeight = vehicle.loadWeight;
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
              this.routeInfo.push({
                route: subDirection,
                departure: departures[subDirectionIndex].toLocaleTimeString('th-TH').substring(0, 5),
                arrival: arrivals[subDirectionIndex].toLocaleTimeString('th-TH').substring(0, 5),
                demand: subDirectionIndex === subDirections.length - 1 ? 0 : demands[subDirectionIndex]
              });
            });
            this.onChangedTab();
          }
        });
      })
      .catch((err) => {
        this.router.navigate(['/not-found']);
      });
  }

  onSubRouteSelected(event) {
    this.subRoute = true;
    this.resultService.sendClearMap();
    var node = event.selected[0].route.split(' ');
    this.selectedResult = [];
    this.selectedResult.push({
      route: node,
      color: 'blue'
    });
  }

  showAllRoute() {
    if (this.selectedRouteInfo.length !== 0) {
      this.subRoute = false;
      this.selectedRouteInfo = [];
      this.onChangedTab();
    }
  }

  onChangedTab() {
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
}
