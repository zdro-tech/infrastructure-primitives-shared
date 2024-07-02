import { Construct } from "constructs";
import { CloudRunDomainMapping } from "@cdktf/provider-google/lib/cloud-run-domain-mapping";
import { CloudRunV2Service } from "@cdktf/provider-google/lib/cloud-run-v2-service";
import { BasePrivateCloudRun, BasePrivateCloudRunConfig } from "./BasePrivateCloudRun.js";
export interface BasePublicCloudRunConfig extends BasePrivateCloudRunConfig {
    domainName: string;
}
export declare class BasePublicCloudRun extends BasePrivateCloudRun {
    config: BasePublicCloudRunConfig;
    constructor(scope: Construct, config: BasePublicCloudRunConfig);
    configure(): CloudRunV2Service;
    configurePublicAccess(cloudRun: CloudRunV2Service): void;
    configureDomainMapping(cloudRun: CloudRunV2Service): CloudRunDomainMapping;
}
