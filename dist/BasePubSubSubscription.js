"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePubSubSubscription = void 0;
const index_js_1 = require("@cdktf/provider-google/lib/pubsub-subscription/index.js");
const index_js_2 = require("@cdktf/provider-google/lib/data-google-pubsub-topic/index.js");
const index_js_3 = require("@cdktf/provider-google/lib/data-google-service-account/index.js");
const index_js_4 = require("@cdktf/provider-google/lib/pubsub-topic/index.js");
class BasePubSubSubscription {
    config;
    scope;
    constructor(scope, config) {
        this.config = config;
        this.scope = scope;
    }
    configure() {
        const pubSubTopic = new index_js_2.DataGooglePubsubTopic(this.scope, `${this.config.topicName}-${this.config.subscriptionName}-topic`, {
            name: this.config.topicName
        });
        const deadLetterTopicForSubscription = new index_js_4.PubsubTopic(this.scope, `${this.config.topicName}.${this.config.subscriptionName}.dead-letter`, {
            name: `${this.config.topicName}.${this.config.subscriptionName}.dead-letter`,
            messageRetentionDuration: `${7 * 24 * 60 * 60}s`,
        });
        new index_js_1.PubsubSubscription(this.scope, `${this.config.topicName}.${this.config.subscriptionName}.subscription.dead-letter`, {
            name: `${this.config.topicName}.${this.config.subscriptionName}.dead-letter`,
            topic: deadLetterTopicForSubscription.name,
            enableMessageOrdering: true,
            filter: this.config.filter || '',
            messageRetentionDuration: `${7 * 24 * 60 * 60}s`,
        });
        const pubSubAuthServiceAccount = new index_js_3.DataGoogleServiceAccount(this.scope, `${this.config.topicName}.${this.config.subscriptionName}-pub-sub-push-auth`, {
            accountId: 'pub-sub-push-auth',
        });
        const topicSubscription = new index_js_1.PubsubSubscription(this.scope, `${this.config.topicName}.${this.config.subscriptionName}-pub-sub-subscription`, {
            name: `${this.config.topicName}.${this.config.subscriptionName}`,
            topic: pubSubTopic.name,
            ackDeadlineSeconds: this.config.ackDeadlineSeconds ?? 60 * 10,
            retryPolicy: {
                minimumBackoff: this.config.minimumBackoff ?? '2s',
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
            enableMessageOrdering: true,
            messageRetentionDuration: `${7 * 24 * 60 * 60}s`,
            retainAckedMessages: false,
            deadLetterPolicy: {
                deadLetterTopic: deadLetterTopicForSubscription.id,
                maxDeliveryAttempts: this.config.maxDeliveryAttempts ?? 30
            }
        });
        return topicSubscription;
    }
}
exports.BasePubSubSubscription = BasePubSubSubscription;
