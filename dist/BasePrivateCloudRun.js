"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePrivateCloudRun = void 0;
const cloud_run_v2_service_1 = require("@cdktf/provider-google/lib/cloud-run-v2-service");
const data_google_compute_network_1 = require("@cdktf/provider-google/lib/data-google-compute-network");
class BasePrivateCloudRun {
    config;
    scope;
    constructor(scope, config) {
        this.config = config;
        this.scope = scope;
    }
    configure(privateVPCName) {
        const privateVPC = this.fetchPrivateVPC(privateVPCName);
        const cloudRun = this.privateCloudRunService(this.config, privateVPC);
        return cloudRun;
    }
    fetchPrivateVPC(privateVPCName) {
        return new data_google_compute_network_1.DataGoogleComputeNetwork(this.scope, `retrieve-cloud-run-vpc-${this.config.cloudRunServiceName}`, {
            name: privateVPCName ?? 'h9th-cloud-run-postgres-redis'
        });
    }
    privateCloudRunService(config, vpcForPrivateAccess) {
        const { region, imagename, cloudRunServiceName, resources, limits } = config;
        const cloudRun = new cloud_run_v2_service_1.CloudRunV2Service(this.scope, `cloud-run-web-service-${this.config.cloudRunServiceName}`, {
            launchStage: "BETA",
            customAudiences: this.config.customAudiences ?? [],
            location: region,
            name: cloudRunServiceName,
            template: {
                executionEnvironment: this.config.executionEnvironment || "EXECUTION_ENVIRONMENT_GEN1",
                vpcAccess: {
                    egress: "PRIVATE_RANGES_ONLY",
                    networkInterfaces: [{
                            network: vpcForPrivateAccess.name
                        }]
                },
                timeout: "3600s",
                serviceAccount: this.config.serviceAccount ?? '',
                maxInstanceRequestConcurrency: config.maxInstanceRequestConcurrency ?? 1,
                scaling: config.scaling ?? {
                    maxInstanceCount: 50
                },
                volumes: config.volumes,
                containers: [
                    {
                        ports: { containerPort: config.port ?? 4000, name: "http1" },
                        image: imagename,
                        resources: resources ?? {
                            cpuIdle: true,
                            startupCpuBoost: true,
                            limits: limits ?? { "cpu": "0.2", "memory": "256Mi" },
                        },
                        env: [...config.env ?? [], ...[
                                { name: "ENVIRONMENT", value: process.env.ENVIRONMENT },
                                { name: "VARIABLES_CONFIG_PATH", value: process.env.VARIABLES_CONFIG_PATH }
                            ]],
                        volumeMounts: config.volumeMounts
                    },
                ],
            },
        });
        return cloudRun;
    }
}
exports.BasePrivateCloudRun = BasePrivateCloudRun;
