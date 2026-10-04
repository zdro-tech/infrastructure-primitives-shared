"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGCPStack = void 0;
const cdktn_1 = require("cdktn");
const provider_1 = require("@cdktn/provider-google/lib/provider");
class BaseGCPStack extends cdktn_1.TerraformStack {
    constructor(scope, name, config) {
        super(scope, name);
        const { region, zone, credentials, project, tfBucketPrefix, tfBucket } = config;
        new provider_1.GoogleProvider(this, "GoogleAuth", {
            region,
            zone,
            credentials,
            project
        });
        new cdktn_1.GcsBackend(this, {
            bucket: tfBucket,
            prefix: tfBucketPrefix,
        });
    }
}
exports.BaseGCPStack = BaseGCPStack;
