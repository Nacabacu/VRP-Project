export interface Client {
    _id?: string;
    clientName: string;
    address: string,
    telNum: string;
    coordinate: [number, number];
    __v?: number;
}
