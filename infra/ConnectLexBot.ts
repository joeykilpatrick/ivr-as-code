import * as crypto from 'crypto';
import * as CDK from 'aws-cdk-lib';
import * as IAM from 'aws-cdk-lib/aws-iam';
import * as Lex from 'aws-cdk-lib/aws-lex';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import * as Connect from 'aws-cdk-lib/aws-connect';
import { ConnectLexBotAssociation } from "cdk-amazon-connect-resources";
import { Construct } from 'constructs';

export type CustomizedBotProperties =
    & Omit<Lex.CfnBotProps,
        | 'autoBuildBotLocales'
        | 'botFileS3Location'
        | 'botLocales'
        | 'dataPrivacy'
        | 'idleSessionTtlInSeconds'
        | 'roleArn'
        >
    & {
        connectInstance: Connect.CfnInstance,
        lambdaCodeHook: Lambda.Function,
        locale: CustomizedBotLocaleProperty,
    }

export type CustomizedBotLocaleProperty =
    & Omit<Lex.CfnBot.BotLocaleProperty, 'intents' | 'localeId'>
    & { intents: Record<string, CustomizedIntentProperty> }
    ;

export type CustomizedIntentProperty =
    & Omit<Lex.CfnBot.IntentProperty, 'name' | 'sampleUtterances'>
    & { sampleUtterances?: readonly string[] }
    ;

export class ConnectLexBot extends CDK.Resource {

    // TODO This role should be able to be shared across bots
    private readonly lexRuntimeRole: IAM.Role;

    public readonly lexBot: Lex.CfnBot;
    public readonly lexBotVersion: Lex.CfnBotVersion;
    public readonly lexBotAlias: Lex.CfnBotAlias;
    public readonly lexBotAssociation: ConnectLexBotAssociation;

    constructor(
        scope: Construct,
        id: string,
        props: CustomizedBotProperties,
    ) {
        super(scope, id);

        this.lexRuntimeRole = new IAM.Role(this, "LexRuntimeRole", {
            roleName: `${props.name}-runtime-role`,
            assumedBy: new IAM.ServicePrincipal("lexv2.amazonaws.com"),
        });
        this.lexRuntimeRole.addToPolicy(
            new IAM.PolicyStatement({
                actions: [
                    "polly:SynthesizeSpeech",
                    "comprehend:DetectSentiment",
                    "lambda:invokeFunction",
                ],
                effect: IAM.Effect.ALLOW,
                resources: ["*"],
            })
        );

        const botLocale: Lex.CfnBot.BotLocaleProperty = {
            ...props.locale,
            localeId: 'en_US',
            intents: Object.entries(props.locale.intents).map(([name, intentProps]): Lex.CfnBot.IntentProperty => {
                return {
                    dialogCodeHook: {
                        enabled: true
                    },
                    fulfillmentCodeHook: {
                        enabled: true
                    },
                    ...intentProps,
                    name,
                    sampleUtterances: intentProps.sampleUtterances?.map((utterance) => {
                        return { utterance }
                    }),
                };
            })
        };

        this.lexBot = new Lex.CfnBot(this, 'lexBot', {
            roleArn: this.lexRuntimeRole.roleArn,
            autoBuildBotLocales: true,
            idleSessionTtlInSeconds: 123,
            dataPrivacy: {
                ChildDirected: false
            },
            botLocales: [ botLocale ],
            ...props,
        });

        // TODO Explain
        const propsToHash: object = {
            ...props,
            connectInstance: undefined,
            lambdaCodeHook: undefined,
        }
        const propsHash = crypto.createHash('md5').update(JSON.stringify(propsToHash)).digest('hex').slice(0, 6);

        this.lexBotVersion = new Lex.CfnBotVersion(this, `lexBotVersion-${propsHash}`, {
            botId: this.lexBot.attrId,
            botVersionLocaleSpecification: [
                {
                    localeId: 'en_US',
                    botVersionLocaleDetails: {
                        sourceBotVersion: 'DRAFT',
                    },
                }
            ]
        });

        this.lexBotAlias = new Lex.CfnBotAlias(this, "lexBotAlias", {
            botAliasName: "LIVE",
            botId: this.lexBot.attrId,
            botVersion: this.lexBotVersion.attrBotVersion,
            botAliasLocaleSettings: [
                {
                    localeId: 'en_US',
                    botAliasLocaleSetting: {
                        codeHookSpecification: props.lambdaCodeHook ? {
                            lambdaCodeHook: {
                                codeHookInterfaceVersion: '1.0',
                                lambdaArn: props.lambdaCodeHook.functionArn,
                            }
                        } : undefined,
                        enabled: true,
                    }
                },
            ]
        });

        this.lexBotAssociation = new ConnectLexBotAssociation(this, 'lexBotAssociation', {
            connectInstanceId: props.connectInstance.ref,
            lexBotAliasArn: this.lexBotAlias.attrArn,
        });
    }

}
