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
    const route = [0, ...this.route, 0];
    const node = [this.result.depot.coordinate];

    this.date = this.result.isAllCompleted ? new Date() : new Date(`${date[2]}/${date[1]}/${date[0]}`);
    this.result.clients.forEach((client) => {
      node.push(client.coordinate);
    });
    
    for (let i = 0; i < route.length - 1; i++) {
      const currentNode = node[route[i]];
      const nextNode = node[route[i + 1]];
      setTimeout(function () {
        this.createDirection(currentNode, nextNode);
      }.bind(this), 200 * i * (this.index + 1));
    }
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
