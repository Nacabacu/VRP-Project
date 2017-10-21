import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
    private isloggedIn = false;

    constructor(
        private http: Http,
        private router: Router
    ) { }

    isAuthenticated(username: string, password: string): Promise<any> {
        return this.http.post('http://localhost:3000/api/account/login', { username, password })
            .toPromise()
            .then((response: Response) => {
                this.isloggedIn = true;
                localStorage.setItem('currentUser', JSON.stringify({
                    username: response.json().username,
                    role: response.json().role,
                    licenseId: response.json().licenseId
                }));

                return response.json().role;
            })
            .catch(this.handleError);
    }

    canActive(path: string): boolean {
        if (localStorage.getItem('currentUser')) {
            const role = JSON.parse(localStorage.getItem('currentUser')).role;
            if (path.includes(role)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    logout() {
        this.isloggedIn = false;
        this.router.navigate(['/login']);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
