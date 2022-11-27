import * as CDK from 'aws-cdk-lib';
import * as IAM from 'aws-cdk-lib/aws-iam';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import * as NodeJSLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as CustomResource from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

export interface LexBotAssociationProps {
    readonly connectInstanceId: string;
    readonly lexBotAliasArn: string;
}

export class LexBotAssociation extends CDK.Resource {

    private customResource: CDK.CustomResource;

    public constructor(scope: Construct, id: string, props: LexBotAssociationProps) {
        super(scope, id);

        const lambda = new NodeJSLambda.NodejsFunction(this, "lexBotAssociationFunction", {
            entry: './custom-resources/LexBotAssociationHandler.ts',
            handler: 'handler',
            runtime: Lambda.Runtime.NODEJS_16_X,
            timeout: CDK.Duration.minutes(5),
            bundling: {
                externalModules: ['aws-sdk'],
            }
        });

        lambda.addToRolePolicy(new IAM.PolicyStatement({
            actions: [
                "connect:AssociateBot",
                "connect:DisassociateBot",
            ],
            resources: ["*"],
        }));

        lambda.addToRolePolicy(new IAM.PolicyStatement({
            actions: [
                // TODO Exact permissions are listed here https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonconnect.html
                "lex:*ResourcePolicy",
                "lex:Get*",
                "lex:List*",
                "*",
            ],
            resources: ["*"],
        }));

        const provider = new CustomResource.Provider(this, `lexBotAssociationProvider`, {
            onEventHandler: lambda,
        })

        this.customResource = new CDK.CustomResource(this, "lexBotAssociationResource", {
            serviceToken: provider.serviceToken,
            properties: props,
        });
    }

}
