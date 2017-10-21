import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ResultService {

  constructor(
    private http: Http,
    private router: Router
  ) { }

  getResults(): Promise<any> {
    return this.http.get('http://localhost:3000/api/vrp/getResults')
      .toPromise()
      .then((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  getResult(id): Promise<any> {
    return this.http.get('http://localhost:3000/api/vrp/getResult/' + id)
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
