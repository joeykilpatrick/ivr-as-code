import * as CDK from 'aws-cdk-lib';
import * as IAM from 'aws-cdk-lib/aws-iam';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import * as NodeJSLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as CustomResource from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

export interface LambdaFunctionAssociationProps {
    readonly connectInstanceId: string;
    readonly functionArn: string;
}

export class LambdaFunctionAssociation extends CDK.Resource {

    private customResource: CDK.CustomResource;

    public constructor(scope: Construct, id: string, props: LambdaFunctionAssociationProps) {
        super(scope, id);

        const lambda = new NodeJSLambda.NodejsFunction(this, "lambdaFunctionAssociationFunction", {
            entry: './custom-resources/LambdaFunctionAssociationHandler.ts',
            handler: 'handler',
            runtime: Lambda.Runtime.NODEJS_16_X,
            timeout: CDK.Duration.minutes(5),
            bundling: {
                externalModules: ['aws-sdk'],
            }
        });

        lambda.addToRolePolicy(new IAM.PolicyStatement({
            actions: [
                "connect:AssociateLambdaFunction",
                "connect:DisassociateLambdaFunction",
            ],
            resources: ["*"],
        }));

        lambda.addToRolePolicy(new IAM.PolicyStatement({
            actions: [
                // TODO Exact permissions are listed here https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonconnect.html
                "lambda:*",
            ],
            resources: [props.functionArn],
        }));

        const provider = new CustomResource.Provider(this, `lambdaFunctionAssociationProvider`, {
            onEventHandler: lambda,
        })

        this.customResource = new CDK.CustomResource(this, "lambdaFunctionAssociationResource", {
            serviceToken: provider.serviceToken,
            properties: props,
        });
    }

}
