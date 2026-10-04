import { Construct } from "constructs";

import { BaseGCPStackConfig } from "./BaseGCPStack.js";
import { PubsubSubscription } from "@cdktn/provider-google/lib/pubsub-subscription/index.js";
import { DataGooglePubsubTopic } from "@cdktn/provider-google/lib/data-google-pubsub-topic/index.js";
import { DataGoogleServiceAccount } from "@cdktn/provider-google/lib/data-google-service-account/index.js";
import { PubsubTopic } from "@cdktn/provider-google/lib/pubsub-topic/index.js";

export interface BasePubSubSubscriptionConfig extends BaseGCPStackConfig {
  topicName: string;
  subscriptionName: string;
  pushEndpoint: string;
  enableMessageOrdering: boolean;
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
      enableMessageOrdering: 'enableMessageOrdering' in this?.config ? this.config.enableMessageOrdering : true,
      filter: this.config.filter || '',
      messageRetentionDuration: `${7 * 24 * 60 * 60}s`,
      // Without this the subscription is deleted after 31 days without a pull and dead letters are dropped.
      expirationPolicy: {
        ttl: ""
      },
    })

    const pubSubAuthServiceAccount = new DataGoogleServiceAccount(this.scope, `${this.config.topicName}.${this.config.subscriptionName}-pub-sub-push-auth`, {
      accountId: 'pub-sub-push-auth',
    })

    const topicSubscription = new PubsubSubscription(this.scope, `${this.config.topicName}.${this.config.subscriptionName}-pub-sub-subscription`, {
      name: `${this.config.topicName}.${this.config.subscriptionName}`,
      topic: pubSubTopic.name,
      ackDeadlineSeconds: this.config.ackDeadlineSeconds ?? 60 * 10,
      retryPolicy: {
        minimumBackoff: this.config.minimumBackoff ?? '10s',
        maximumBackoff: this.config.maximumBackoff ?? '600s',
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
      enableMessageOrdering: 'enableMessageOrdering' in this?.config ? this.config.enableMessageOrdering : true,
      messageRetentionDuration: `${7 * 24 * 60 * 60}s`,
      retainAckedMessages: false,
      deadLetterPolicy: {
        deadLetterTopic: deadLetterTopicForSubscription.id,
        maxDeliveryAttempts: this.config.maxDeliveryAttempts ?? 30
      }
    })
    return topicSubscription
  }


}