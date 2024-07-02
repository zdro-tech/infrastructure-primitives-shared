import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
interface BaseGCPStackConfig {
    region: string;
    zone: string;
    credentials: string | undefined;
    project: string;
    tfBucket: string;
    tfBucketPrefix: string;
    registryName: string;
    registryHostname: string;
}
declare class BaseGCPStack extends TerraformStack {
    constructor(scope: Construct, name: string, config: BaseGCPStackConfig);
}
export { BaseGCPStack, BaseGCPStackConfig };
