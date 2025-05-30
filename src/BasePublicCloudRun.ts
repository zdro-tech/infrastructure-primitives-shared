import { Construct } from "constructs";

import { DataGoogleIamPolicy } from "@cdktf/provider-google/lib/data-google-iam-policy";
import { CloudRunServiceIamPolicy } from "@cdktf/provider-google/lib/cloud-run-service-iam-policy";
import { CloudRunDomainMapping } from "@cdktf/provider-google/lib/cloud-run-domain-mapping";
import { CloudRunV2Service } from "@cdktf/provider-google/lib/cloud-run-v2-service";
import { BasePrivateCloudRun, BasePrivateCloudRunConfig } from "./BasePrivateCloudRun.js";

export interface BasePublicCloudRunConfig extends BasePrivateCloudRunConfig {
  domainName: string
}

export class BasePublicCloudRun extends BasePrivateCloudRun {
  config: BasePublicCloudRunConfig;

  constructor(scope: Construct, config: BasePublicCloudRunConfig) {
    super(scope, config);
    this.config = config
  }

  configure(privateVPCName?: string): CloudRunV2Service {
    const privateCloudRun = super.configure(privateVPCName)
    this.configureDomainMapping(privateCloudRun)
    this.configurePublicAccess(privateCloudRun)
    return privateCloudRun
  }
  
  configurePublicAccess(cloudRun: CloudRunV2Service) {
    const policy_data = new DataGoogleIamPolicy(this.scope, `datanoauth-${this.config.cloudRunServiceName}`, {
      binding: [
        {
          role: "roles/run.invoker",
          members: ["allUsers"],
        },
      ],
    });

    new CloudRunServiceIamPolicy(this.scope, `runsvciampolicy-${this.config.cloudRunServiceName}`, {
      service: cloudRun.name,
      policyData: policy_data.policyData,
    });
  }

  configureDomainMapping(cloudRun: CloudRunV2Service): CloudRunDomainMapping {
    return new CloudRunDomainMapping(this.scope, `cloud-run-domain-mapping-${this.config.cloudRunServiceName}`, {
      location: this.config.region,
      name: this.config.domainName,
      metadata: {
        namespace: this.config.project
      },
      spec: {
        routeName: cloudRun.name,
      },
    })
  }
}