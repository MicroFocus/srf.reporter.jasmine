/*! (c) Copyright 2015 - 2018 Micro Focus or one of its affiliates.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Apache License 2.0 - Apache Software Foundation
// www.apache.org
// Apache License Version 2.0, January 2004 http://www.apache.org/licenses/ TERMS AND CONDITIONS FOR USE, REPRODUCTION ...
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
*/

import {SrfJasmineReporter} from "./srf-jasmine-reporter";
import {JasmineReporter, JasmineReporterOptions} from "./jasmine-reporter-types";

import _ = require("lodash");
import {LogSwitch, SrfJsonLogger} from "./core/srf-json-logger";
import {SrfReporterFacade} from "./core/srf-reporter-facade";


class SrfJasmineReporterDelegate implements JasmineReporter {
    private _jasmineReporter: JasmineReporter;

    /**
     *
     * @param options - SRF Options: debug: boolean, clientId: string, client
     *
     */
    constructor(options: JasmineReporterOptions){
        let {debug, mode, srfUrl, clientId, clientSecret} = options;
        const logSwitch: LogSwitch = debug ? LogSwitch.ON : LogSwitch.OFF;
        const logger: SrfJsonLogger = new SrfJsonLogger(logSwitch);
        const reporterType:string = mode;
        let srfReporterBaseUrl = srfUrl || getEnvironmnetVariable("SRF_REPORTER_URL");

        switch (reporterType){
            case "cloud": throw new Error("not implemented");
            default:
                clientId = clientId || getEnvironmnetVariable("SRF_CLIENT_ID");
                clientSecret = clientSecret || getEnvironmnetVariable("SRF_CLIENT_SECRET");

                srfReporterBaseUrl += srfReporterBaseUrl.match(/\/$/) ? "rest/gateway/" : "/rest/gateway/";
                const srfReporterFacade = new SrfReporterFacade(srfReporterBaseUrl, logger);
                options = _.defaults(options, {clientId: clientId, clientSecret: clientSecret}) as JasmineReporterOptions;
                this._jasmineReporter = new SrfJasmineReporter(srfReporterFacade, options, logger);
        }
    }

    public jasmineStarted(suiteInfo: any): void {
        this._jasmineReporter.jasmineStarted(suiteInfo);
    }

    public suiteStarted(result: any): void {
        this._jasmineReporter.suiteStarted(result);
    }

    public specStarted(result: any): void {
        this._jasmineReporter.specStarted(result);
    }

    public specDone(result: any): void {
        this._jasmineReporter.specDone(result);
    }

    public suiteDone(result: any): void {
        this._jasmineReporter.suiteDone(result);
    }

    public jasmineDone(): void {
        this._jasmineReporter.jasmineDone();
    }
}

function getEnvironmnetVariable(name: string): string {
    const environmentVariable: string = process.env[name];
    if (!environmentVariable)
        throw new Error(`Missing ${name} environment variable or option wasn't passed`);

    return environmentVariable;
}

export = SrfJasmineReporterDelegate;