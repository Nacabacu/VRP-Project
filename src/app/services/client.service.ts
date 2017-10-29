import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { Client } from '../shared/client';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ClientService {

    clientUrl = 'http://localhost:3000/api/client';

    constructor(private http: Http, private router: Router) { }

    createClient(companyData: Client) {
        const headers = new Headers();
        headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');
        headers.set('Content-Type', 'application/json');
        const opts = new RequestOptions();
        opts.headers = headers;
        const body = { client: companyData };
        return this.http.post(this.clientUrl + '/create/', JSON.stringify(body), opts)
            .toPromise()
            .then((response) => {
                return response;
            })
            .catch(this.handleError);
    }

    deleteClient(companyId) {
        const headers = new Headers();
        headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');
        const opts = new RequestOptions();
        opts.headers = headers;
        return this.http.delete(this.clientUrl + '/delete/' + companyId, opts)
            .toPromise()
            .then((response) => {
                this.router.navigate(['/planner/client']);
            })
            .catch(this.handleError);
    }

    getClient(companyId) {
        const headers = new Headers();
        headers.set('Access-Control-Allow-Origin', ['http://localhost:4200']);
        const opts = new RequestOptions();
        opts.headers = headers;
        return this.http.get(this.clientUrl + '/get/' + companyId, opts)
            .toPromise()
            .then((response) => {
                return response.json();
            })
            .catch(this.handleError);
    }

    getAllClients(): Promise<Client[]> {
        const headers = new Headers();
        headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');
        const opts = new RequestOptions();
        opts.headers = headers;
        return this.http.get(this.clientUrl + '/get', opts)
            .toPromise()
            .then((response) => {
                return response.json().clients;
            })
            .catch(this.handleError);
    }

    updateClient(companyData) {
        const headers = new Headers();
        headers.set('Access-Control-Allow-Origin', ['http://localhost:4200']);
        headers.set('Access-Control-Allow-Methods', "GET, POST, HEAD, OPTIONS, PUT, DELETE, PATCH");
        headers.set('Content-Type', 'application/json');
        const opts = new RequestOptions();
        opts.headers = headers;
        const body = { client: companyData };
        return this.http.put(this.clientUrl + '/update/' + companyData._id, JSON.stringify(body), opts)
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
