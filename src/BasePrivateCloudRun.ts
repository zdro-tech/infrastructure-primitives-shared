import { Construct } from "constructs";

import { CloudRunV2Service, CloudRunV2ServiceTemplateContainersResources, CloudRunV2ServiceTemplateScaling } from "@cdktf/provider-google/lib/cloud-run-v2-service";
import { DataGoogleComputeNetwork } from "@cdktf/provider-google/lib/data-google-compute-network";
import { BaseGCPStackConfig } from "./BaseGCPStack.js";

export interface BasePrivateCloudRunConfig extends BaseGCPStackConfig {
  imagename: string;
  cloudRunServiceName: string;
  resources?: CloudRunV2ServiceTemplateContainersResources;
  limits?: { [key: string]: string };
  port?: number;
  serviceAccount?: string;
  maxInstanceRequestConcurrency?: number;
  scaling?: CloudRunV2ServiceTemplateScaling;
  executionEnvironment?: "EXECUTION_ENVIRONMENT_GEN1" | "EXECUTION_ENVIRONMENT_GEN2",
  customAudiences?: string[]
}

export class BasePrivateCloudRun {
  config: BasePrivateCloudRunConfig;
  scope: Construct;
  constructor(scope: Construct, config: BasePrivateCloudRunConfig) {
    this.config = config
    this.scope = scope
  }

  configure(privateVPCName?: string): CloudRunV2Service {
    const privateVPC = this.privateVPC(privateVPCName)
    const cloudRun = this.privateCloudRunService(this.config, privateVPC)
    return cloudRun
  }

  privateVPC(privateVPCName?: string) {
    return new DataGoogleComputeNetwork(this.scope, `retrieve-cloud-run-vpc-${this.config.cloudRunServiceName}`, {
      name: privateVPCName ?? 'h9th-cloud-run-postgres-redis'
    });
  }

  privateCloudRunService(config: BasePrivateCloudRunConfig, vpcForPrivateAccess: DataGoogleComputeNetwork): CloudRunV2Service {
    const { region, imagename, cloudRunServiceName, resources, limits } = config
    const cloudRun = new CloudRunV2Service(this.scope, `cloud-run-web-service-${this.config.cloudRunServiceName}`, {
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
    return cloudRun
  }

}