import { factoryOrValue } from 'rxjs/operator/multicast';
export class AuthService {
    loggedIn = false;
    role = '';

    isAuthenticated() {
        const promise = new Promise(
            (resolve, reject) => {

            }
        );
    }
    login() {
        this.loggedIn = true;
    }

    logout() {
        this.loggedIn = false;
    }
}
