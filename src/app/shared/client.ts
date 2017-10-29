import { ClientBranch } from './client-branch';

export interface Client {
    companyName: string;
    branches: ClientBranch[];
    __v?: number;
}
