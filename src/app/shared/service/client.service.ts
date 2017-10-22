import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { Client } from '../../client';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ClientService {

    constructor(private http: Http, private router: Router) { }

    getClient(companyId) {
        const headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
        const opts = new RequestOptions();
        opts.headers = headers;
        return this.http.get('http://localhost:3000/api/client/get/' + companyId, opts)
            .toPromise()
            .then((response) => {
                return response.json();
            })
            .catch(this.handleError);
    }

    getAllClients(): Promise<Client[]> {
        const headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
        const opts = new RequestOptions();
        opts.headers = headers;
        return this.http.get('http://localhost:3000/api/client/get', opts)
            .toPromise()
            .then((response) => {
                const clients: Client[] = response.json().clients;
                clients.map((client, index) => {
                    client.companyNumber = index + 1;
                    return client;
                });
                return clients;
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
