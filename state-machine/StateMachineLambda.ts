import {inject, injectable} from "inversify";
import type {ConnectContactFlowEvent} from "aws-lambda";
import * as AWS from 'aws-sdk';

import {ConnectHandler} from "./ConnectHandler";
import {Environment} from "./environment";
import {StateMachineSession} from "./session";
import {StateMachineEngine} from "./engine";
import {EngineResponse, LambdaResponse} from "./types";

// @ts-ignore For webpack to include all machines in its bundle
// require.context('./machines', true, /^\.\/.*$/, 'sync'); // TODO Not working

import "./machines/InitialStateMachine";

@injectable()
export class StateMachineLambda extends ConnectHandler {

    constructor(
        @inject(Environment) protected environment: Environment,
        @inject(AWS.Connect) protected connectClient: AWS.Connect,
    ) {
        super(environment, connectClient);
    }

    public async handler(event: ConnectContactFlowEvent): Promise<LambdaResponse> {

        const session = StateMachineSession.fromEvent(event, this.environment);

        const engineResponse: EngineResponse = await StateMachineEngine.run(session);

        switch (engineResponse.command) {
            case "HANGUP":
            case "ERROR":
                return {
                    MACH_ROUTE_COMMAND: engineResponse.command
                };
            case "QUEUE":
                const queueARN = await this.getQueueArn(engineResponse.queueName);
                if (!queueARN) {
                    throw Error(`Could not find an ARN for queue "${engineResponse.queueName}"`);
                }
                const queueFlowARN = await this.getFlowArn(engineResponse.queueFlowName);
                if (!queueFlowARN) {
                    throw Error(`Could not find an ARN for queue flow "${engineResponse.queueFlowName}"`);
                }
                return {
                    MACH_ROUTE_COMMAND: engineResponse.command,
                    MACH_ROUTE_DESTINATION: queueARN,
                    MACH_QUEUE_FLOW: queueFlowARN
                };
            case "PHONE":
                return {
                    MACH_ROUTE_COMMAND: engineResponse.command,
                    MACH_ROUTE_DESTINATION: engineResponse.phoneNumber
                };
            case "PROMPT":
                return {
                    MACH_ROUTE_COMMAND: engineResponse.command,
                    MACH_SPOKEN_TEXT_SSML: engineResponse.ssml,
                    MACH_SESSION: session.toJSONString()
                };
            case "LEXBOT":
                return {
                    MACH_ROUTE_COMMAND: engineResponse.command,
                    MACH_ROUTE_DESTINATION: engineResponse.config.lexBot,
                    MACH_BARGE_IN: engineResponse.config.bargeIn ? "true" : "false",
                    MACH_DTMF_TIMEOUT_MS: engineResponse.config.dtmfTimeoutMs.toString(10),
                    MACH_SPOKEN_TEXT_SSML: engineResponse.config.ssml,
                    MACH_SESSION: session.toJSONString(),
                };
            case "ATTRIBUTE":
                return {
                    MACH_ROUTE_COMMAND: engineResponse.command,
                    MACH_ATTRIBUTE_KEY: engineResponse.key,
                    MACH_ATTRIBUTE_VALUE: engineResponse.value,
                    MACH_SESSION: session.toJSONString(),
                };
            case "VOICE":
                return  {
                    MACH_ROUTE_COMMAND: engineResponse.command,
                    MACH_ROUTE_DESTINATION: engineResponse.voice,
                    MACH_SESSION: session.toJSONString(),
                };
            case "LOGGING":
                return  {
                    MACH_ROUTE_COMMAND: engineResponse.command,
                    MACH_ROUTE_DESTINATION: engineResponse.logging,
                    MACH_SESSION: session.toJSONString(),
                };
            case "STREAMING":
                return  {
                    MACH_ROUTE_COMMAND: engineResponse.command,
                    MACH_ROUTE_DESTINATION: engineResponse.streaming,
                    MACH_SESSION: session.toJSONString(),
                };
        }
    }

}
