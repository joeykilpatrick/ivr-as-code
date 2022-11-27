import type {CloudFormationCustomResourceEvent, CloudFormationCustomResourceResponse} from "aws-lambda";
import {
    ConnectClient,
    AssociateBotCommand,
    DisassociateBotCommand,
} from '@aws-sdk/client-connect';

import { LexBotAssociationProps } from "./LexBotAssociation";

const connect = new ConnectClient({});

export async function handler(event: CloudFormationCustomResourceEvent): Promise<CloudFormationCustomResourceResponse> {
    const props = event.ResourceProperties as LexBotAssociationProps & { ServiceToken: string };
    console.log({props});

    switch (event.RequestType) {

        case "Create":
        case "Update": {
            const command = new AssociateBotCommand({
                InstanceId: props.connectInstanceId,
                LexV2Bot: {
                    AliasArn: props.lexBotAliasArn,
                },
            });
            await connect.send(command);

            return {
                ...event,
                Status: "SUCCESS",
                PhysicalResourceId: props.lexBotAliasArn,
            };
        }

        case "Delete": {
            const command = new DisassociateBotCommand({
                InstanceId: props.connectInstanceId,
                LexV2Bot: {
                    AliasArn: props.lexBotAliasArn,
                },
            });
            await connect.send(command);

            return {
                ...event,
                Status: "SUCCESS",
            };
        }

    }
}
