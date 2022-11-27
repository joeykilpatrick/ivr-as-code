import * as CDK from 'aws-cdk-lib';
import * as IAM from 'aws-cdk-lib/aws-iam';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import * as Connect from 'aws-cdk-lib/aws-connect';
import { transformAndValidateSync } from "class-transformer-validator";

import { ConnectLambdaFunction, ConnectPhoneNumber, ConnectLexBot } from ".";
import { Environment as StateMachineEnvironment } from "../state-machine/environment";
import { generateContactFlowContent } from "./contact-flow";
import { Environment } from "./environment";

const environment: Environment = transformAndValidateSync(Environment, process.env);

const stackNameKebab: string = 'kilpatrick-cloud-ivr-as-code';

const app = new CDK.App();
const stack = new CDK.Stack(app, stackNameKebab, {
    env: {
        account: environment.ACCOUNT_ID,
        region: environment.REGION,
    }
});

const connectInstance = new Connect.CfnInstance(stack, 'connectInstance', {
    attributes: {
        inboundCalls: true,
        outboundCalls: false,
        contactflowLogs: true,
    },
    identityManagementType: 'CONNECT_MANAGED',
    instanceAlias: stackNameKebab,
});

const genericLexBotFunction = new Lambda.Function(stack, 'genericLexBotFunction', {
    handler: 'handler.handler',
    code: Lambda.Code.fromAsset('../build/generic-bot.zip'),
    functionName: `${stackNameKebab}-lex-bot-generic`,
    runtime: Lambda.Runtime.NODEJS_14_X,
    timeout: CDK.Duration.seconds(15),
});

genericLexBotFunction.addPermission("lexBotCodeHookFunctionPermission", {
    principal: new IAM.ServicePrincipal('lex.amazonaws.com'),
    action: 'lambda:InvokeFunction',
});

const mainMenuBot = new ConnectLexBot(stack, 'mainMenuBot', {
    connectInstance,
    name: `${stackNameKebab}-main-menu`,
    lambdaCodeHook: genericLexBotFunction,
    locale: {
        nluConfidenceThreshold: 0.75,
        intents: {
            "PlayTicTacToe": {
                sampleUtterances: ['tick tack toe', 'play tick tack toe', 'play game'],
            },
            "TransferToJoey": {
                sampleUtterances: ['Joey', 'call Joey', 'speak to Joey', 'transfer to Joey', 'transfer'],
            },
            "FallbackIntent": {
                parentIntentSignature: "AMAZON.FallbackIntent",
            },
        },
    },
});

const yesNoBot = new ConnectLexBot(stack, 'yesNoBot', {
    connectInstance,
    name: `${stackNameKebab}-yes-no`,
    lambdaCodeHook: genericLexBotFunction,
    locale: {
        nluConfidenceThreshold: 0.75,
        intents: {
            "Yes": {
                sampleUtterances: ['yes', 'yeah', 'right', 'okay'],
            },
            "No": {
                sampleUtterances: ['no', 'nah', 'nope'],
            },
            "FallbackIntent": {
                parentIntentSignature: "AMAZON.FallbackIntent",
            },
        },
    },
});

const ticTacToeBot = new ConnectLexBot(stack, 'ticTacToeBot', {
    connectInstance,
    name: `${stackNameKebab}-tic-tac-toe`,
    lambdaCodeHook: genericLexBotFunction,
    locale: {
        nluConfidenceThreshold: 0.75,
        slotTypes: [
            {
                name: "TileNumber",
                parentSlotTypeSignature: "AMAZON.AlphaNumeric",
                valueSelectionSetting: {
                    regexFilter: {
                        pattern: "[1-9]"
                    },
                    resolutionStrategy: "ORIGINAL_VALUE"
                },
            },
        ],
        intents: {
            "Board": {
                sampleUtterances: ['tiles', 'current board', 'board', 'readout'],
            },
            "SelectTile": {
                sampleUtterances: ['{tile}'],
                slots: [
                    {
                        name: 'tile',
                        slotTypeName: "TileNumber",
                        valueElicitationSetting: {
                            slotConstraint: "Required",
                            promptSpecification: {
                                messageGroupsList: [
                                    {
                                        message: {
                                            plainTextMessage: {
                                                value: "This text should never be heard."
                                            },
                                        },
                                    }
                                ],
                                maxRetries: 1,
                                allowInterrupt: true
                            },
                        }
                    },
                ],
                slotPriorities: [
                    {
                        slotName: 'tile',
                        priority: 0
                    }
                ],
            },
            "FallbackIntent": {
                parentIntentSignature: "AMAZON.FallbackIntent",
            },
        },
    },
});

const stateMachineEnvironment: Omit<StateMachineEnvironment, 'AWS_REGION'> = {
    // AWS_REGION is automatically added to all Lambdas
    CONNECT_INSTANCE_ID: connectInstance.attrId,
    MAIN_MENU_BOT_ALIAS_ARN: mainMenuBot.lexBotAlias.attrArn,
    TIC_TAC_TOE_BOT_ALIAS_ARN: ticTacToeBot.lexBotAlias.attrArn,
    YES_NO_BOT_ALIAS_ARN: yesNoBot.lexBotAlias.attrArn,
};

const stateMachineFunction = new ConnectLambdaFunction(stack, 'stateMachineFunction', {
    connectInstance,
    handler: 'handler.handler',
    code: Lambda.Code.fromAsset('../build/state-machine.zip'),
    functionName: `${stackNameKebab}-state-machine`,
    runtime: Lambda.Runtime.NODEJS_14_X,
    timeout: CDK.Duration.seconds(8),
    environment: stateMachineEnvironment,
});

const stateMachineContactFlow = new Connect.CfnContactFlow(stack, 'ivrContactFlow', {
    content: generateContactFlowContent(stateMachineFunction.lambda.functionArn),
    instanceArn: connectInstance.attrArn,
    name: 'GeneratedStateMachine',
    state: 'ACTIVE',
    type: "CONTACT_FLOW",
});

const connectPhoneNumber = new ConnectPhoneNumber(stack, 'connectPhoneNumber', {
    type: 'DID',
    countryCode: 'US',
    connectInstance,
    contactFlow: stateMachineContactFlow,
});

new CDK.CfnOutput(stack, 'phoneNumberOutput', {
    exportName: 'phone-number',
    value: connectPhoneNumber.phoneNumber.attrAddress,
});

app.synth();
