import * as CDK from 'aws-cdk-lib';
import * as IAM from 'aws-cdk-lib/aws-iam';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import * as NodeJSLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as CustomResource from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

export interface PhoneNumberContactFlowAssociationProps {
    readonly connectInstanceId: string;
    readonly contactFlowId: string;
    readonly phoneNumberId: string;
}

export class PhoneNumberContactFlowAssociation extends CDK.Resource {

    private customResource: CDK.CustomResource;

    public constructor(scope: Construct, id: string, props: PhoneNumberContactFlowAssociationProps) {
        super(scope, id);

        const lambda = new NodeJSLambda.NodejsFunction(this, "phoneNumberContactFlowAssociationFunction", {
            entry: './custom-resources/PhoneNumberContactFlowAssociationHandler.ts',
            handler: 'handler',
            runtime: Lambda.Runtime.NODEJS_16_X,
            timeout: CDK.Duration.minutes(5),
            bundling: {
                externalModules: ['aws-sdk'],
            }
        });

        lambda.addToRolePolicy(new IAM.PolicyStatement({
            actions: [
                "connect:AssociatePhoneNumberContactFlow",
                "connect:DisassociatePhoneNumberContactFlow",
            ],
            resources: ["*"],
        }));

        const provider = new CustomResource.Provider(this, `phoneNumberContactFlowAssociationProvider`, {
            onEventHandler: lambda,
        })

        this.customResource = new CDK.CustomResource(this, "phoneNumberContactFlowAssociationResource", {
            serviceToken: provider.serviceToken,
            properties: props,
        });
    }

}
