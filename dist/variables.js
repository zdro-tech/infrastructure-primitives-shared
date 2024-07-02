"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV_CONFIG = exports.GCP_REGISTRY_HOSTNAME = exports.GCP_REGISTRY_NAME = exports.GCP_TF_BUCKET_NAME = exports.GCP_CREDENTIALS = exports.GCP_ZONE = exports.GCP_REGION = exports.GCP_PROJECT_ID = void 0;
exports.GCP_PROJECT_ID = process.env["GCP_PROJECT_ID"];
exports.GCP_REGION = process.env["GCP_REGION"];
exports.GCP_ZONE = process.env["GCP_ZONE"] ?? `${exports.GCP_REGION}-c`;
exports.GCP_CREDENTIALS = process.env["GCP_SERVICE_ACCOUNT_FILE"] ? Buffer.from(String(process.env["GCP_SERVICE_ACCOUNT_FILE"]), 'base64').toString('utf8') : undefined;
exports.GCP_TF_BUCKET_NAME = process.env["GCP_TF_BUCKET_NAME"];
exports.GCP_REGISTRY_NAME = process.env["GCP_CONTAINER_REGISTRY_NAME"];
exports.GCP_REGISTRY_HOSTNAME = process.env["GCP_CONTAINER_REGISTRY_HOSTNAME"] ?? `${exports.GCP_REGION}-docker.pkg.dev`;
const mustHaveEnvVars = [{ GCP_PROJECT_ID: exports.GCP_PROJECT_ID, GCP_REGION: exports.GCP_REGION, GCP_ZONE: exports.GCP_ZONE, GCP_CREDENTIALS: exports.GCP_CREDENTIALS, GCP_TF_BUCKET_NAME: exports.GCP_TF_BUCKET_NAME, GCP_REGISTRY_NAME: exports.GCP_REGISTRY_NAME, GCP_REGISTRY_HOSTNAME: exports.GCP_REGISTRY_HOSTNAME }];
const missingVars = [];
for (const [key, value] of Object.entries(mustHaveEnvVars)) {
    if (!value) {
        missingVars.push(key);
    }
}
if (missingVars.length) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
}
exports.ENV_CONFIG = {
    credentials: exports.GCP_CREDENTIALS,
    zone: exports.GCP_ZONE,
    project: exports.GCP_PROJECT_ID,
    region: exports.GCP_REGION,
    tfBucket: exports.GCP_TF_BUCKET_NAME,
    registryName: exports.GCP_REGISTRY_NAME,
    registryHostname: exports.GCP_REGISTRY_HOSTNAME
};
