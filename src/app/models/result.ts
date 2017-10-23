export class Result {
    public _id;
    public date;
    public time;
    public clients = new Array<{
        clientName: '',
        demand: 0,
        waitTime: 0
    }>();
    public vehicles = new Array<{
        loadWeight: 0,
        isCompleted: false,
        route: [''],
        driver: {
            name: '',
            licenseNo: '',
            vehicleNo: ''
        }
    }>();
    public depot = {
        depotName: '',
        coordinate: []
    };
    public isAllCompleted: boolean;

    constructor() {}
}
