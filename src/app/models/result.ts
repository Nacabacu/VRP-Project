export class Result {
    public _id;
    public date;
    public time;
    public dateTime;
    public clients = new Array<{
        index: number,
        clientName: string,
        demand: number,
        waitTime: number,
        coordinate: [number]
    }>();
    public vehicles = new Array<{
        loadWeight: number,
        isCompleted: boolean,
        route: [number],
        driver: {
            name: string,
            licenseNo: string,
            vehicleNo: string
        },
        color: string
    }>();
    public depot = {
        depotName: String,
        coordinate: []
    };
    public isAllCompleted: boolean;
    public times: [[number]];
    public method: String;
    public vehicleCapacity: Number;
    public availableDriver: Number;

    constructor() {}
}
