import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class DepotService {

    depotUrl = 'http://localhost:3000/api/depot';

    constructor(private http: Http) { }

    createDepot(depotData) {
        const headers = new Headers();
        headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');
        headers.set('Content-Type', 'application/json');
        const opts = new RequestOptions();
        opts.headers = headers;
        const body = { depot: depotData };
        return this.http.post(this.depotUrl + '/create/', JSON.stringify(body), opts)
            .toPromise()
            .then((response) => {
                return response;
            })
            .catch(this.handleError);
    }

    deleteDepot(depotId) {
        const headers = new Headers();
        headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');
        const opts = new RequestOptions();
        opts.headers = headers;
        return this.http.delete(this.depotUrl + '/delete/' + depotId, opts)
            .toPromise()
            .then((response) => {
                return response;
            })
            .catch(this.handleError);
    }

    getDepot(depotId) {
        const headers = new Headers();
        headers.set('Access-Control-Allow-Origin', ['http://localhost:4200']);
        const opts = new RequestOptions();
        opts.headers = headers;
        return this.http.get(this.depotUrl + '/get/' + depotId, opts)
            .toPromise()
            .then((response) => {
                return response.json();
            })
            .catch(this.handleError);
    }

    getAllDepots(): Promise<any[]> {
        const headers = new Headers();
        headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');
        const opts = new RequestOptions();
        opts.headers = headers;
        return this.http.get(this.depotUrl + '/get', opts)
            .toPromise()
            .then((response) => {
                return response.json().depots;
            })
            .catch(this.handleError);
    }

    updateDepot(depotData) {
        const headers = new Headers();
        headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');
        headers.set('Access-Control-Allow-Methods', "GET, POST, HEAD, OPTIONS, PUT, DELETE, PATCH");
        headers.set('Content-Type', 'application/json');
        const opts = new RequestOptions();
        opts.headers = headers;
        const body = { client: depotData };
        return this.http.put(this.depotUrl + '/update/' + depotData._id, JSON.stringify(body), opts)
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
