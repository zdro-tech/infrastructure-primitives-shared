import { BaseGCPStackConfig } from "./BaseGCPStack.js";

export const GCP_PROJECT_ID = process.env["GCP_PROJECT_ID"]
export const GCP_REGION = process.env["GCP_REGION"]
export const GCP_ZONE = process.env["GCP_ZONE"] ?? `${GCP_REGION}-c`;
export const GCP_CREDENTIALS = process.env["GCP_SERVICE_ACCOUNT_FILE"] ? Buffer.from(String(process.env["GCP_SERVICE_ACCOUNT_FILE"]), 'base64').toString('utf8') : undefined;
export const GCP_TF_BUCKET_NAME = process.env["GCP_TF_BUCKET_NAME"]
export const GCP_REGISTRY_NAME = process.env["GCP_CONTAINER_REGISTRY_NAME"]
export const GCP_REGISTRY_HOSTNAME = process.env["GCP_CONTAINER_REGISTRY_HOSTNAME"] ?? `${GCP_REGION}-docker.pkg.dev`;

const mustHaveEnvVars = [{ GCP_PROJECT_ID, GCP_REGION, GCP_ZONE, GCP_CREDENTIALS, GCP_TF_BUCKET_NAME, GCP_REGISTRY_NAME, GCP_REGISTRY_HOSTNAME }]

const missingVars = []
for (const [key, value] of Object.entries(mustHaveEnvVars)) {
    if (!value) {
        missingVars.push(key)
    }
}
if (missingVars.length) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`)
}

export const ENV_CONFIG = {
    credentials: GCP_CREDENTIALS,
    zone: GCP_ZONE,
    project: GCP_PROJECT_ID,
    region: GCP_REGION,
    tfBucket: GCP_TF_BUCKET_NAME,
    registryName: GCP_REGISTRY_NAME,
    registryHostname: GCP_REGISTRY_HOSTNAME
} as BaseGCPStackConfig