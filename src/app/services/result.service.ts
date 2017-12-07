import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Result } from './../models/result';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ResultService {

  vrpUrl = 'http://localhost:3000/api/vrp';
  clearMapSubject = new Subject<boolean>();

  constructor(
    private http: Http,
    private router: Router
  ) { }

  saveResult(request): Promise<any> {
    return this.http.post('http://localhost:3000/api/vrp/saveRoute', request)
      .toPromise()
      .then((response: Response) => {
        return response;
      })
      .catch(this.handleError);
  }

  getResults(): Promise<any> {
    return this.http.get(this.vrpUrl + '/getResults')
      .toPromise()
      .then((response: Response) => {
        const results = new Array<Result>();
        response.json().results.forEach((result) => {
          results.push(this.createResultModel(result));
        });
        return results;
      })
      .catch(this.handleError);
  }

  getResult(id): Promise<Result> {
    return this.http.get(this.vrpUrl + '/getResult/' + id)
      .toPromise()
      .then((response: Response) => {
        return this.createResultModel(response.json());
      })
      .catch(this.handleError);
  }

  updateDriverDone(id, licenseNo): Promise<any> {
    return this.http.put(this.vrpUrl + '/updateProgress', { id, licenseNo })
      .toPromise()
      .then((response: Response) => {
        return response;
      })
      .catch(this.handleError);
  }

  sendClearMap() {
    this.clearMapSubject.next(true);
  }

  clearMap(): Observable<any> {
    return this.clearMapSubject.asObservable();
  }

  private createResultModel(input): Result {
    const dateTime = new Date(input.date);
    input.dateTime = input.date;
    input.date = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`;
    input.time = /\d*:\d*/g.exec(dateTime.toString())[0];

    input.isAllCompleted = true;
    input.vehicles.forEach((vehicle) => {
      if (!vehicle.isCompleted) {
        input.isAllCompleted = false;
      }
    });

    return input;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
