import { IDriver } from './driver';

export interface IPlanning {
    date: string,
    method: string,
    workingHour: number,
    numVehicles: number,
    vehicleCapacity: number,
    routeLocks: Array<number[]>,
    depot: {
        depotName: string,
        coordinate: [number, number]
    },
    drivers: IDriver[],
    clients: {
        clientName: string,
        coordinate: [number, number]
        demand: number,
        waitTime: number
    }[]
}