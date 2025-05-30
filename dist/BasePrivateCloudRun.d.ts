import { Construct } from "constructs";
import { CloudRunV2Service, CloudRunV2ServiceTemplateContainersEnv, CloudRunV2ServiceTemplateContainersResources, CloudRunV2ServiceTemplateContainersVolumeMounts, CloudRunV2ServiceTemplateScaling, CloudRunV2ServiceTemplateVolumes } from "@cdktf/provider-google/lib/cloud-run-v2-service";
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
    volumes?: CloudRunV2ServiceTemplateVolumes[];
    volumeMounts?: CloudRunV2ServiceTemplateContainersVolumeMounts[];
    env?: CloudRunV2ServiceTemplateContainersEnv[];
}
export declare class BasePrivateCloudRun {
    config: BasePrivateCloudRunConfig;
    scope: Construct;
    constructor(scope: Construct, config: BasePrivateCloudRunConfig);
    configure(privateVPCName?: string): CloudRunV2Service;
    fetchPrivateVPC(privateVPCName?: string): DataGoogleComputeNetwork;
    privateCloudRunService(config: BasePrivateCloudRunConfig, vpcForPrivateAccess: DataGoogleComputeNetwork): CloudRunV2Service;
}
