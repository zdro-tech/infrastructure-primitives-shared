import { Construct } from "constructs";
import { CloudRunV2Service, CloudRunV2ServiceTemplateContainersResources, CloudRunV2ServiceTemplateScaling } from "@cdktf/provider-google/lib/cloud-run-v2-service";
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
    serviceAccount?: string;
    maxInstanceRequestConcurrency?: number;
    scaling?: CloudRunV2ServiceTemplateScaling;
    executionEnvironment?: "EXECUTION_ENVIRONMENT_GEN1" | "EXECUTION_ENVIRONMENT_GEN2";
    customAudiences?: string[];
}
export declare class BasePrivateCloudRun {
    config: BasePrivateCloudRunConfig;
    scope: Construct;
    constructor(scope: Construct, config: BasePrivateCloudRunConfig);
    configure(privateVPCName?: string): CloudRunV2Service;
    privateVPC(privateVPCName?: string): DataGoogleComputeNetwork;
    privateCloudRunService(config: BasePrivateCloudRunConfig, vpcForPrivateAccess: DataGoogleComputeNetwork): CloudRunV2Service;
}
