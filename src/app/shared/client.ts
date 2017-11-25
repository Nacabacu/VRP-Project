export interface Client {
    _id?: string;
    clientName: string;
    address: string,
    phoneNumber: string;
    coordinate: [number, number];
    __v?: number;
}
