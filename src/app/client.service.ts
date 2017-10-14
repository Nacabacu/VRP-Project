import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Company } from './company';

@Injectable()
export class ClientService {
    constructor(private http: Http) { }

    getCompany(): Promise<Company[]> {
        return this.http.get('http://localhost:3000/api/client/get')
            .toPromise()
            .then(response => {
                const companyData = [];
                response.json().clients.map(function (client, index) {
                    const companyRow = {};
                    companyRow['companyNumber'] = index + 1;
                    companyRow['companyName'] = client.companyName;
                    companyRow['numberOfBranch'] = client.branches.length;
                    companyRow['edit'] = '';
                    companyData.push(companyRow);
                });
                return companyData;
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}


