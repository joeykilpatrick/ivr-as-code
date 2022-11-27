import type {ConnectContactFlowEvent} from "aws-lambda";
import "reflect-metadata";

import type {ConnectAttributeMap} from "./types";
import {DiContainer} from "./dependencyContainer";
import {StateMachineLambda} from "./StateMachineLambda";
import {LexBotResult} from "./types";

const stateMachineLambda: StateMachineLambda = DiContainer.resolve<StateMachineLambda>(StateMachineLambda);

(async () => {

    const event: ConnectContactFlowEvent = {
        Name: 'ContactFlowEvent',
        Details: {
            Parameters: {},
            ContactData: {
                Attributes: {},
                Channel: 'VOICE',
                ContactId: '1234-5678-9000',
                CustomerEndpoint: null,
                InitialContactId: '1234-5678-9000',
                InitiationMethod: 'INBOUND',
                InstanceARN: 'arn:aws:connect:us-east-1:111111111111:instance/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
                PreviousContactId: '1234-5678-9000',
                Queue: null,
                SystemEndpoint: null,
                MediaStreams: {
                    Customer: {
                        Audio: null,
                    },
                },
            },
        }
    };

    loop:
    while (true) {

        const { ContactData: contactData } = event.Details;

        // Run the state machine lambda
        const responseAttributes = await stateMachineLambda.handler(event);

        console.log({
            ...responseAttributes,
            MACH_SESSION: undefined,
        });

        // Set all of the attributes that the state machine responses with
        const newAttributes: Record<string, string> = responseAttributes; // Widening type
        contactData.Attributes = {
            ...contactData.Attributes,
            MACH_ROUTE_COMMAND: newAttributes.MACH_ROUTE_COMMAND!,
            MACH_ROUTE_DESTINATION: newAttributes.MACH_ROUTE_DESTINATION!,
            MACH_QUEUE_FLOW: newAttributes.MACH_QUEUE_FLOW!,
            MACH_SPOKEN_TEXT_SSML: newAttributes.MACH_SPOKEN_TEXT_SSML!,
            MACH_BARGE_IN: newAttributes.MACH_BARGE_IN!,
            MACH_SESSION: newAttributes.MACH_SESSION!,
            MACH_ATTRIBUTE_KEY: newAttributes.MACH_ATTRIBUTE_KEY!,
            MACH_ATTRIBUTE_VALUE: newAttributes.MACH_ATTRIBUTE_VALUE!,
            MACH_LEXBOT_RESULT: newAttributes.MACH_LEXBOT_RESULT!,
            MACH_DTMF_TIMEOUT_MS: newAttributes.MACH_DTMF_TIMEOUT_MS!,
        };

        switch (responseAttributes.MACH_ROUTE_COMMAND) {
            case "HANGUP":
            case "QUEUE":
            case "PHONE":
                break loop;
            case "LEXBOT":
                const lexBotResponse: LexBotResult<any> = {
                    intent: "FallbackIntent",
                    inputTranscript: 'banana',
                    slots: undefined,
                    // @ts-ignore
                    getSlots: () => {
                        return undefined;
                    }
                };
                contactData.Attributes['MACH_LEXBOT_RESULT'] = JSON.stringify(lexBotResponse);
                continue;
            case "STREAMING":
                switch (responseAttributes.MACH_ROUTE_DESTINATION) {
                    case "Start":
                        contactData.MediaStreams.Customer.Audio = {
                            StartFragmentNumber: "123123123123",
                            StartTimestamp: "123123123123",
                            StreamARN: "",
                        };
                        continue;
                    case "Stop":
                        contactData.MediaStreams.Customer.Audio = {
                            StartFragmentNumber: "123123123123",
                            StartTimestamp: "123123123123",
                            StreamARN: "",
                            StopFragmentNumber: "",
                            StopTimestamp: "",
                        };
                        continue;
                    default:
                        continue;
                }
            case "LOGGING":
                continue;
            case "ATTRIBUTE":
                const { MACH_ATTRIBUTE_KEY, MACH_ATTRIBUTE_VALUE } = responseAttributes;
                contactData.Attributes[MACH_ATTRIBUTE_KEY] = MACH_ATTRIBUTE_VALUE;
                continue;
            case "PROMPT":
            case "VOICE":
                continue;
            case "ERROR":
                break loop;
        }

    }

})()

export async function handler(event: ConnectContactFlowEvent): Promise<ConnectAttributeMap> {
    return await stateMachineLambda.handler(event);
}
