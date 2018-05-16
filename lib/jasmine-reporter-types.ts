
import {SrfReporterOptions} from "./core/srf-reporter-types";

export interface JasmineReporter {
    jasmineStarted(suiteInfo: jasmine.SuiteInfo) : void;
    suiteStarted(result: jasmine.CustomReporterResult) : void;
    specStarted(result: jasmine.CustomReporterResult) : void;
    specDone(result: jasmine.CustomReporterResult) : void;
    suiteDone(result: jasmine.CustomReporterResult) : void;
    jasmineDone() : void;
}



export interface JasmineReporterOptions extends SrfReporterOptions{
    debug: boolean;
    clientId?: string;
    clientSecret?: string;
}