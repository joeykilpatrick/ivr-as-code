import * as Lambda from 'aws-cdk-lib/aws-lambda';
import * as Connect from 'aws-cdk-lib/aws-connect';
import { Construct } from 'constructs';

import { LambdaFunctionAssociation } from "./custom-resources";

export class ConnectLambdaFunction extends Construct {

    public readonly lambda: Lambda.Function;
    public readonly lambdaAssociation: LambdaFunctionAssociation;

    constructor(
        scope: Construct,
        id: string,
        props: Lambda.FunctionProps & { connectInstance: Connect.CfnInstance },
    ) {
        super(scope, id);

        this.lambda = new Lambda.Function(this, 'function', props);

        this.lambdaAssociation = new LambdaFunctionAssociation(this, 'functionAssociation', {
            connectInstanceId: props.connectInstance.ref,
            functionArn: this.lambda.functionArn,
        });
    }

}
