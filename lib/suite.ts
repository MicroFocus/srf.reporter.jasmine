
import {ReporterStatuses} from "./core/srf-reporter-types";

export class Suite {

    public status: ReporterStatuses;
    public failedSpecExpectations: string[];
    private _id;

    constructor(id: string) {
        this.status = "success";
        this.failedSpecExpectations = [];
        this._id = id;
    }
}