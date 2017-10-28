import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Result } from './../models/result';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ResultService {
  clearMapSubject = new Subject<boolean>();

  constructor(
    private http: Http,
    private router: Router
  ) { }

  getResults(): Promise<any> {
    return this.http.get('http://localhost:3000/api/vrp/getResults')
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
    return this.http.get('http://localhost:3000/api/vrp/getResult/' + id)
      .toPromise()
      .then((response: Response) => {
        return this.createResultModel(response.json());
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
