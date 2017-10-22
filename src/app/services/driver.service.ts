import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

@Injectable()
export class DriverService {

  constructor(
    private http: Http,
    private router: Router
  ) { }

  getDrivers(): Promise<any> {
    return this.http.get('http://localhost:3000/api/driver/get')
      .toPromise()
      .then((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
