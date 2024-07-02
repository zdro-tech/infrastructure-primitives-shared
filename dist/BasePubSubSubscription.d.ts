import { Construct } from "constructs";
import { BaseGCPStackConfig } from "./BaseGCPStack.js";
import { PubsubSubscription } from "@cdktf/provider-google/lib/pubsub-subscription/index.js";
export interface BasePubSubSubscriptionConfig extends BaseGCPStackConfig {
    topicName: string;
    subscriptionName: string;
    pushEndpoint: string;
    ackDeadlineSeconds?: number;
    maxDeliveryAttempts?: number;
    minimumBackoff?: string;
    maximumBackoff?: string;
    filter?: string;
}
export declare class BasePubSubSubscription {
    config: BasePubSubSubscriptionConfig;
    scope: Construct;
    constructor(scope: Construct, config: BasePubSubSubscriptionConfig);
    configure(): PubsubSubscription;
}
