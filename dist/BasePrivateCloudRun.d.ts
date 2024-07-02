import { Construct } from "constructs";
import { CloudRunV2Service, CloudRunV2ServiceTemplateContainersResources } from "@cdktf/provider-google/lib/cloud-run-v2-service";
import { DataGoogleComputeNetwork } from "@cdktf/provider-google/lib/data-google-compute-network";
import { BaseGCPStackConfig } from "./BaseGCPStack.js";
export interface BasePrivateCloudRunConfig extends BaseGCPStackConfig {
    imagename: string;
    cloudRunServiceName: string;
    resources?: CloudRunV2ServiceTemplateContainersResources;
    limits?: {
        [key: string]: string;
    };
    port?: number;
    maxInstanceRequestConcurrency?: number;
    executionEnvironment?: "EXECUTION_ENVIRONMENT_GEN1" | "EXECUTION_ENVIRONMENT_GEN2";
}
export declare class BasePrivateCloudRun {
    config: BasePrivateCloudRunConfig;
    scope: Construct;
    constructor(scope: Construct, config: BasePrivateCloudRunConfig);
    configure(): CloudRunV2Service;
    privateVPC(): DataGoogleComputeNetwork;
    privateCloudRunService(config: BasePrivateCloudRunConfig, vpcForPrivateAccess: DataGoogleComputeNetwork): CloudRunV2Service;
}
