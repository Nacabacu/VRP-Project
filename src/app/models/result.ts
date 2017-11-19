export class Result {
    public _id;
    public date;
    public time;
    public dateTime;
    public clients: {
        index: number,
        clientName: string,
        demand: number,
        waitTime: number,
        coordinate: [number]
    }[];
    public vehicles: {
        loadWeight: number,
        isCompleted: boolean,
        route: [number],
        driver: {
            name: string,
            licenseNo: string,
            vehicleNo: string
        },
        color: string
    }[];
    public depot = {
        depotName: String,
        coordinate: []
    };
    public isAllCompleted: boolean;
    public times: [[number]]

    constructor() {}
}
