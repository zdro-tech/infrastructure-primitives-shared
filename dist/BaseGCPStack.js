"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGCPStack = void 0;
const cdktf_1 = require("cdktf");
const provider_1 = require("@cdktf/provider-google/lib/provider");
class BaseGCPStack extends cdktf_1.TerraformStack {
    constructor(scope, name, config) {
        super(scope, name);
        const { region, zone, credentials, project, tfBucketPrefix, tfBucket } = config;
        new provider_1.GoogleProvider(this, "GoogleAuth", {
            region,
            zone,
            credentials,
            project
        });
        new cdktf_1.GcsBackend(this, {
            bucket: tfBucket,
            prefix: tfBucketPrefix,
        });
    }
}
exports.BaseGCPStack = BaseGCPStack;
