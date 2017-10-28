export class Result {
    public _id;
    public date;
    public time;
    public clients = new Array<{
        index: Number,
        clientName: String,
        demand: Number,
        waitTime: Number,
        coordinate: [Number]
    }>();
    public vehicles = new Array<{
        loadWeight: Number,
        isCompleted: Boolean,
        route: [Number],
        driver: {
            name: String,
            licenseNo: String,
            vehicleNo: String
        },
        color: String
    }>();
    public depot = {
        depotName: String,
        coordinate: []
    };
    public isAllCompleted: boolean;

    constructor() {}
}
