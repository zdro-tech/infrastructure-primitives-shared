import { Construct } from "constructs";
import { TerraformStack, GcsBackend } from "cdktf";

import { GoogleProvider } from "@cdktf/provider-google/lib/provider";

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

class BaseGCPStack extends TerraformStack {
  constructor(scope: Construct, name: string, config: BaseGCPStackConfig) {
    super(scope, name);
    const { region, zone, credentials, project, tfBucketPrefix, tfBucket } = config

    new GoogleProvider(this, "GoogleAuth", {
      region,
      zone,
      credentials,
      project
    });

    new GcsBackend(this, {
      bucket: tfBucket,
      prefix: tfBucketPrefix,
    });

  }
}

export { BaseGCPStack, BaseGCPStackConfig };