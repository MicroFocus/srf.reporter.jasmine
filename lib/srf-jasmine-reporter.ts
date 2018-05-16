
import {JasmineReporter, JasmineReporterOptions} from "./jasmine-reporter-types";
import {Suite} from "./suite";

import _ = require("lodash");
import {SrfJsonLogger} from "./core/srf-json-logger";
import {SrfReporterFacade} from "./core/srf-reporter-facade";
import {RemoteExecutionContext, ReporterStatuses, ReporterStep, StepRole} from "./core/srf-reporter-types";

export class SrfJasmineReporter implements JasmineReporter{

    private _sessionId: string;
    private _suiteStack: Suite[];

    constructor(private _srfReporterFacade: SrfReporterFacade ,options: JasmineReporterOptions, private _logger: SrfJsonLogger) {
        this._suiteStack = [];
        this.init(options);
    }

    public jasmineStarted(suiteInfo: jasmine.SuiteInfo): void {
        this._logger.debug("SrfJasmineReporter.jasmineStarted: " + JSON.stringify(suiteInfo));
    }

    public suiteStarted(result: jasmine.CustomReporterResult): void {
        this._logger.debug("SrfJasmineReporter.suiteStarted: " + result.description);

        this._suiteStack.push(new Suite(result.id));

        const reporterStep = this.createReporterStep("suite-begin", result.description, "success");
        this._srfReporterFacade.reportStep(reporterStep);
    }

    public specStarted(result: jasmine.CustomReporterResult): void {
        this._logger.debug("SrfJasmineReporter.specStarted: " + result.description);
        const reporterStep = this.createReporterStep("test-begin", result.description, "success");
        this._srfReporterFacade.reportStep(reporterStep);
    }

    public specDone(result: jasmine.CustomReporterResult): void {
        this._logger.debug("SrfJasmineReporter.specDone: " + result);
        let status: ReporterStatuses = "success";
        let errors: string[];

        if (result.status !== "passed"){
            status = "failed";
            errors = _.map(result.failedExpectations ,failedExpectation => failedExpectation.stack);

            let suite = this._suiteStack[this._suiteStack.length - 1]; // stack top
            suite.failedSpecExpectations = suite.failedSpecExpectations.concat(errors);
        }

        const reporterStep = this.createReporterStep("test-end", result.description, status, errors);
        this._srfReporterFacade.reportStep(reporterStep);
    }

    public suiteDone(result: jasmine.CustomReporterResult): void {
        this._logger.debug("SrfJasmineReporter.suiteDone: " + result.description);
        let suite = this._suiteStack.pop();

        if (suite.failedSpecExpectations.length > 0) {
            suite.status = "failed";
            if (this._suiteStack.length > 0) {
                let parentSuite = this._suiteStack[this._suiteStack.length - 1];
                parentSuite.failedSpecExpectations = parentSuite.failedSpecExpectations.concat(suite.failedSpecExpectations); // Aggregate errors
            }
        }

        const reporterStep = this.createReporterStep("suite-end", result.description, suite.status, suite.failedSpecExpectations);
        this._srfReporterFacade.reportStep(reporterStep);
    }

    public jasmineDone(): void {
        this._logger.debug("SrfJasmineReporter.jasmineDone: done");
        this._srfReporterFacade.deleteSession(this._sessionId);
    }

    private init(options: JasmineReporterOptions) : void {
        this._logger.debug("SrfJasmineReporter.init: Creating execution session for " + options.clientId);
        const remoteExecutionContext: RemoteExecutionContext = {
            clientId: options.clientId,
            clientSecret: options.clientSecret
        };

        this._sessionId = this._srfReporterFacade.createSession(remoteExecutionContext);
        process.env.SRF_CLIENT_SECRET = this._sessionId;
        process.env.ACCESS_TOKEN_SECRET = this._sessionId; // for Leanft execution.
    }

    private createReporterStep(role: StepRole, description: string, status: ReporterStatuses, errors: string[] = null) : ReporterStep {
        errors = errors && errors.length > 0 ? errors : null;
        return {
            description: description,
            status: status,
            sessionId: this._sessionId,
            role: role,
            errors: errors
        };
    }

}