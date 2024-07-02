import { BaseGCPStackConfig } from "./BaseGCPStack"
import { ENV_CONFIG} from "./variables"

export const rightEnvironmentConfig = (): BaseGCPStackConfig => {
    if (process.env["ENVIRONMENT"] === "production") {
        return ENV_CONFIG
    }
    if (process.env["ENVIRONMENT"] === "development") {
        return ENV_CONFIG
    }
    return ENV_CONFIG
}

export const currentEnvironmentName = (): string => {
    if (process.env["ENVIRONMENT"] === "production") {
        return "production"
    }
    if (process.env["ENVIRONMENT"] === "development") {
        return "development"
    }
    return "development"
}