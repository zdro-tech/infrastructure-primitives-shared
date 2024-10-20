"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePublicCloudRun = void 0;
const data_google_iam_policy_1 = require("@cdktf/provider-google/lib/data-google-iam-policy");
const cloud_run_service_iam_policy_1 = require("@cdktf/provider-google/lib/cloud-run-service-iam-policy");
const cloud_run_domain_mapping_1 = require("@cdktf/provider-google/lib/cloud-run-domain-mapping");
const BasePrivateCloudRun_js_1 = require("./BasePrivateCloudRun.js");
class BasePublicCloudRun extends BasePrivateCloudRun_js_1.BasePrivateCloudRun {
    config;
    constructor(scope, config) {
        super(scope, config);
        this.config = config;
    }
    configure(privateVPCName) {
        const privateCloudRun = super.configure(privateVPCName);
        this.configureDomainMapping(privateCloudRun);
        this.configurePublicAccess(privateCloudRun);
        return privateCloudRun;
    }
    configurePublicAccess(cloudRun) {
        const policy_data = new data_google_iam_policy_1.DataGoogleIamPolicy(this.scope, `datanoauth-${this.config.cloudRunServiceName}`, {
            binding: [
                {
                    role: "roles/run.invoker",
                    members: ["allUsers"],
                },
            ],
        });
        new cloud_run_service_iam_policy_1.CloudRunServiceIamPolicy(this.scope, `runsvciampolicy-${this.config.cloudRunServiceName}`, {
            service: cloudRun.name,
            policyData: policy_data.policyData,
        });
    }
    configureDomainMapping(cloudRun) {
        return new cloud_run_domain_mapping_1.CloudRunDomainMapping(this.scope, `cloud-run-domain-mapping-${this.config.cloudRunServiceName}`, {
            location: this.config.region,
            name: this.config.domainName,
            metadata: {
                namespace: this.config.project
            },
            spec: {
                routeName: cloudRun.name,
            },
        });
    }
}
exports.BasePublicCloudRun = BasePublicCloudRun;
