import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class DepotService {

    depotUrl = 'http://localhost:3000/api/depot';

    constructor(private http: Http, private router: Router) { }

    deleteDepot(depotId) {
        return this.http.delete(this.depotUrl + '/delete/' + depotId)
            .toPromise()
            .then((response) => {
                return response;
            })
            .catch(this.handleError);
    }

    getAllDepots(): Promise<any[]> {
        return this.http.get(this.depotUrl + '/get')
            .toPromise()
            .then((response) => {
                return response.json().depots;
            })
            .catch(this.handleError);
    }

    updateDepot(depotData) {
        const body = { depots: depotData };
        return this.http.put(this.depotUrl + '/updates/', body)
            .toPromise()
            .then((response) => {
                return response;
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
