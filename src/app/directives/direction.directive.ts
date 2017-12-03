import { Subscription } from 'rxjs/Subscription';
import { ResultService } from './../services/result.service';
import { Observable } from 'rxjs/Observable';
import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { Directive, Input, OnDestroy } from '@angular/core';
declare var google: any;

@Directive({
  selector: 'agm-direction'
})
export class DirectionDirective {

  @Input() result;
  @Input() route;
  @Input() color;
  @Input() showAll;
  @Input() index;
  @Input() subRoute;

  date;
  
  directionsDisplays = [];
  clearMapSubscription: Subscription;

  constructor(
    private resultService: ResultService,
    private gmapsApi: GoogleMapsAPIWrapper,
    private apiLoader: MapsAPILoader
  ) { }

  ngOnInit() {
    if (!this.showAll) {
      this.clearMapSubscription = this.resultService.clearMap().subscribe((res) => {
        if (res) {
          this.clearDirections();
        }
      });
    }

    var date = this.result.date.split('/');
    this.date = new Date() >= new Date(this.result.dateTime) ? new Date() : new Date(this.result.dateTime);

    if (this.subRoute) {
      var origin = this.route[0] === 'D' ? this.result.depot.coordinate : this.result.clients[this.route[0] - 1].coordinate;
      var destination = this.route[1] === 'D' ? this.result.depot.coordinate : this.result.clients[this.route[1] - 1].coordinate;
      this.createDirection(origin, destination);
    }
    else {
      var waypoints = [];

      this.route.forEach((point) => {
        waypoints.push({
          location: this.result.clients[point - 1].coordinate
        });
      });

      this.createDirections();
    }
  }

  private createDirections() {
    var waypoints = [];
    this.gmapsApi.getNativeMap().then((map) => {
      this.apiLoader.load().then(() => {
        this.route.forEach((point) => {
          const coordinates = this.result.clients[point - 1].coordinate;
          waypoints.push({
            location: new google.maps.LatLng(coordinates[0], coordinates[1])
          });
        });
        const directionsService = new google.maps.DirectionsService();
        const directionsDisplay = new google.maps.DirectionsRenderer({
          polylineOptions: {
            strokeColor: this.color
          },
          suppressMarkers: true,
          suppressInfoWindows: true
        });
        directionsDisplay.setMap(map);
        directionsService.route({
          origin: {
            lat: this.result.depot.coordinate[0],
            lng: this.result.depot.coordinate[1]
          },
          destination: {
            lat: this.result.depot.coordinate[0],
            lng: this.result.depot.coordinate[1]
          },
          waypoints: waypoints,
          travelMode: 'DRIVING',
          drivingOptions: {
            departureTime: this.date
          }
        }, (response, status) => {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            setTimeout(function () {
              this.createDirections();
            }.bind(this), Math.floor(Math.random() * 1000), 300);
          }
        });

        this.directionsDisplays.push(directionsDisplay);
      });
    });
  }

  private clearDirections() {
    this.directionsDisplays.forEach((directionsDisplay) => {
      directionsDisplay.setMap(null);
    });
  }

  private createDirection(origin, destination) {
    this.gmapsApi.getNativeMap().then((map) => {
      this.apiLoader.load().then(() => {
        const directionsService = new google.maps.DirectionsService();
        const directionsDisplay = new google.maps.DirectionsRenderer({
          polylineOptions: {
            strokeColor: this.color
          },
          suppressMarkers: true,
          suppressInfoWindows: true
        });
        directionsDisplay.setMap(map);
        directionsService.route({
          origin: {
            lat: origin[0],
            lng: origin[1]
          },
          destination: {
            lat: destination[0],
            lng: destination[1]
          },
          travelMode: 'DRIVING',
          drivingOptions: {
            departureTime: this.date
          }
        }, (response, status) => {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            setTimeout(function () {
              this.createDirection(origin, destination)
            }.bind(this), Math.floor(Math.random() * 1000), 300);
          }
        });

        this.directionsDisplays.push(directionsDisplay);
      });
    });
  }

  ngOnDestroy() {
    if (!this.showAll) {
      this.clearMapSubscription.unsubscribe();
    }
  }

}
