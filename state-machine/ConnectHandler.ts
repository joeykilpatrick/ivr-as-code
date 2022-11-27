import * as AWS from 'aws-sdk';
import Connect = AWS.Connect;
import type {ConnectContactFlowEvent} from "aws-lambda";
import {inject, injectable} from "inversify";
import {MemoizeExpiring} from 'typescript-memoize'

import {ConnectAttributeMap} from "./types";
import {Environment} from "./environment";

@injectable()
export abstract class ConnectHandler {

    protected constructor(
        @inject(Environment) protected environment: Environment,
        @inject(Connect) protected connectClient: Connect
    ) {}

    abstract handler(event: ConnectContactFlowEvent): Promise<ConnectAttributeMap>;

    @MemoizeExpiring(5 * 60 * 1000) // 5 minutes
    async getQueues(): Promise<Connect.QueueSummary[]> {
        let queueListResponse: Connect.ListQueuesResponse | undefined;
        const queueList: Connect.QueueSummary[] = [];
        const params: Connect.ListQueuesRequest = {
            InstanceId: this.environment.CONNECT_INSTANCE_ID,
            NextToken: undefined
        };
        do {
            queueListResponse = await this.connectClient.listQueues(params).promise();
            params.NextToken = queueListResponse.NextToken;
            if (queueListResponse.QueueSummaryList) {
                queueList.push(...queueListResponse.QueueSummaryList);
            }
        } while (queueListResponse.NextToken);
        return queueList;
    }

    async getQueueArn(queueName: string): Promise<string | undefined> {
        const queues = await this.getQueues();
        const queue = queues.find(queue => queue.Name === queueName);
        return queue && queue.Arn;
    }

    @MemoizeExpiring(5 * 60 * 1000) // 5 minutes
    async getFlows(): Promise<Connect.ContactFlowSummary[]> {
        let flowListResponse: Connect.ListContactFlowsResponse;
        const flowLists: Connect.ContactFlowSummary[] = [];
        const params: Connect.ListContactFlowsRequest = {
            InstanceId: this.environment.CONNECT_INSTANCE_ID
        };
        do {
            flowListResponse = await this.connectClient.listContactFlows(params).promise();
            params.NextToken = flowListResponse.NextToken;
            flowListResponse.ContactFlowSummaryList && flowLists.push(...flowListResponse.ContactFlowSummaryList);
        } while (flowListResponse.NextToken);
        return flowLists;
    }

    async getFlowArn(flowName: string): Promise<string | undefined> {
        const flows = await this.getFlows();
        const flow = flows.find(flow => flow.Name === flowName);
        return flow && flow.Arn;
    }

}
