import { Construct } from "constructs";

import { BaseGCPStackConfig } from "./BaseGCPStack.js";
import { PubsubSubscription } from "@cdktf/provider-google/lib/pubsub-subscription/index.js";
import { DataGooglePubsubTopic } from "@cdktf/provider-google/lib/data-google-pubsub-topic/index.js";
import { DataGoogleServiceAccount } from "@cdktf/provider-google/lib/data-google-service-account/index.js";
import { PubsubTopic } from "@cdktf/provider-google/lib/pubsub-topic/index.js";

export interface BasePubSubSubscriptionConfig extends BaseGCPStackConfig {
  topicName: string;
  subscriptionName: string;
  pushEndpoint: string;
  ackDeadlineSeconds?: number
  maxDeliveryAttempts?: number;
  minimumBackoff?: string;
  maximumBackoff?: string;
  filter?: string;
}

export class BasePubSubSubscription {
  config: BasePubSubSubscriptionConfig;
  scope: Construct;
  constructor(scope: Construct, config: BasePubSubSubscriptionConfig) {
    this.config = config
    this.scope = scope
  }

  configure(): PubsubSubscription {
    const pubSubTopic = new DataGooglePubsubTopic(this.scope, `${this.config.topicName}-${this.config.subscriptionName}-topic`, {
      name: this.config.topicName
    })

    const deadLetterTopicForSubscription = new PubsubTopic(this.scope, `${this.config.topicName}.${this.config.subscriptionName}.dead-letter`, {
      name: `${this.config.topicName}.${this.config.subscriptionName}.dead-letter`,
      messageRetentionDuration: `${7 * 24 * 60 * 60}s`,
    })

    new PubsubSubscription(this.scope, `${this.config.topicName}.${this.config.subscriptionName}.subscription.dead-letter`, {
      name: `${this.config.topicName}.${this.config.subscriptionName}.dead-letter`,
      topic: deadLetterTopicForSubscription.name,
      enableMessageOrdering: true,
      filter: this.config.filter || '',
      messageRetentionDuration: `${7 * 24 * 60 * 60}s`,
    })

    const pubSubAuthServiceAccount = new DataGoogleServiceAccount(this.scope, `${this.config.topicName}.${this.config.subscriptionName}-pub-sub-push-auth`, {
      accountId: 'pub-sub-push-auth',
    })

    const topicSubscription = new PubsubSubscription(this.scope, `${this.config.topicName}.${this.config.subscriptionName}-pub-sub-subscription`, {
      name: `${this.config.topicName}.${this.config.subscriptionName}`,
      topic: pubSubTopic.name,
      ackDeadlineSeconds: this.config.ackDeadlineSeconds ?? 60 * 10,
      retryPolicy: {
        minimumBackoff: this.config.minimumBackoff ?? '2s',
        maximumBackoff: this.config.maximumBackoff ?? '120s',
      },

      pushConfig: {
        pushEndpoint: this.config.pushEndpoint,
        oidcToken: {
          serviceAccountEmail: pubSubAuthServiceAccount.email
        }
      },
      expirationPolicy: {
        ttl: ""
      },
      enableMessageOrdering: true,
      messageRetentionDuration: `${7 * 24 * 60 * 60}s`,
      retainAckedMessages: false,
      deadLetterPolicy: {
        deadLetterTopic: deadLetterTopicForSubscription.id,
        maxDeliveryAttempts: this.config.maxDeliveryAttempts ?? 5
      }
    })
    return topicSubscription
  }


}