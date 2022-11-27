import type {CloudFormationCustomResourceEvent, CloudFormationCustomResourceResponse} from "aws-lambda";
import {
    ConnectClient,
    AssociateLambdaFunctionCommand,
    DisassociateLambdaFunctionCommand,
} from '@aws-sdk/client-connect';

import { LambdaFunctionAssociationProps } from "./LambdaFunctionAssociation";

const connect = new ConnectClient({});

export async function handler(event: CloudFormationCustomResourceEvent): Promise<CloudFormationCustomResourceResponse> {
    const props = event.ResourceProperties as LambdaFunctionAssociationProps & { ServiceToken: string };
    console.log({props});

    switch (event.RequestType) {

        case "Create":
        case "Update": {
            const command = new AssociateLambdaFunctionCommand({
                InstanceId: props.connectInstanceId,
                FunctionArn: props.functionArn,
            });
            await connect.send(command);

            return {
                ...event,
                Status: "SUCCESS",
                PhysicalResourceId: props.functionArn,
            };
        }

        case "Delete": {
            const command = new DisassociateLambdaFunctionCommand({
                InstanceId: props.connectInstanceId,
                FunctionArn: props.functionArn,
            });
            await connect.send(command);

            return {
                ...event,
                Status: "SUCCESS",
            };
        }

    }
}
