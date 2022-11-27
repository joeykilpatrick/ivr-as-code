import type {CloudFormationCustomResourceEvent, CloudFormationCustomResourceResponse} from "aws-lambda";
import {
    ConnectClient,
    AssociatePhoneNumberContactFlowCommand,
    DisassociatePhoneNumberContactFlowCommand,
} from '@aws-sdk/client-connect';

import { PhoneNumberContactFlowAssociationProps } from "./PhoneNumberContactFlowAssociation";

const connect = new ConnectClient({});

export async function handler(event: CloudFormationCustomResourceEvent): Promise<CloudFormationCustomResourceResponse> {
    const props = event.ResourceProperties as PhoneNumberContactFlowAssociationProps & { ServiceToken: string };
    console.log({props});

    switch (event.RequestType) {

        case "Create":
        case "Update": {
            // TODO Should check if another number is associated first
            const command = new AssociatePhoneNumberContactFlowCommand({
                InstanceId: props.connectInstanceId,
                PhoneNumberId: props.phoneNumberId,
                ContactFlowId: props.contactFlowId,
            });
            await connect.send(command);

            return {
                ...event,
                Status: "SUCCESS",
                PhysicalResourceId: props.phoneNumberId,
            };
        }

        case "Delete": {
            // TODO Should check that this number is the one associated first
            const command = new DisassociatePhoneNumberContactFlowCommand({
                InstanceId: props.connectInstanceId,
                PhoneNumberId: props.phoneNumberId,
            });
            await connect.send(command);

            return {
                ...event,
                Status: "SUCCESS",
            };
        }

    }
}
