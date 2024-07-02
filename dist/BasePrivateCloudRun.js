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
        const privateVPC = this.privateVPC(privateVPCName);
        const cloudRun = this.privateCloudRunService(this.config, privateVPC);
        return cloudRun;
    }
    privateVPC(privateVPCName) {
        return new data_google_compute_network_1.DataGoogleComputeNetwork(this.scope, 'retrieve-cloud-run-vpc', {
            name: privateVPCName ?? 'h9th-cloud-run-postgres-redis'
        });
    }
    privateCloudRunService(config, vpcForPrivateAccess) {
        const { region, imagename, cloudRunServiceName, resources, limits } = config;
        const cloudRun = new cloud_run_v2_service_1.CloudRunV2Service(this.scope, "GcpCDKCloudRunWebAPI", {
            launchStage: "BETA",
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
                maxInstanceRequestConcurrency: config.maxInstanceRequestConcurrency ?? 1,
                containers: [
                    {
                        ports: { containerPort: config.port ?? 4000, name: "http1" },
                        image: imagename,
                        resources: resources ?? {
                            cpuIdle: true,
                            startupCpuBoost: true,
                            limits: limits ?? { "cpu": "0.1", "memory": "256Mi" },
                        },
                        env: [
                            { name: "ENVIRONMENT", value: process.env.ENVIRONMENT },
                            { name: "VARIABLES_CONFIG_PATH", value: process.env.VARIABLES_CONFIG_PATH }
                        ],
                    },
                ],
            },
        });
        return cloudRun;
    }
}
exports.BasePrivateCloudRun = BasePrivateCloudRun;
