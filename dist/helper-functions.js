"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentEnvironmentName = exports.rightEnvironmentConfig = void 0;
const variables_1 = require("./variables");
const rightEnvironmentConfig = () => {
    if (process.env["ENVIRONMENT"] === "production") {
        return variables_1.ENV_CONFIG;
    }
    if (process.env["ENVIRONMENT"] === "development") {
        return variables_1.ENV_CONFIG;
    }
    return variables_1.ENV_CONFIG;
};
exports.rightEnvironmentConfig = rightEnvironmentConfig;
const currentEnvironmentName = () => {
    if (process.env["ENVIRONMENT"] === "production") {
        return "production";
    }
    if (process.env["ENVIRONMENT"] === "development") {
        return "development";
    }
    return "development";
};
exports.currentEnvironmentName = currentEnvironmentName;
