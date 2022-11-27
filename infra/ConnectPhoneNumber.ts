import * as Connect from 'aws-cdk-lib/aws-connect';
import { Construct } from 'constructs';

import { PhoneNumberContactFlowAssociation } from "./custom-resources";

export class ConnectPhoneNumber extends Construct {

    public readonly phoneNumber: Connect.CfnPhoneNumber;
    public readonly phoneNumberAssociation: PhoneNumberContactFlowAssociation;

    constructor(
        scope: Construct,
        id: string,
        props: Omit<Connect.CfnPhoneNumberProps, 'targetArn'> & {
            connectInstance: Connect.CfnInstance,
            contactFlow: Connect.CfnContactFlow,
        },
    ) {
        super(scope, id);

        this.phoneNumber = new Connect.CfnPhoneNumber(this, 'phoneNumber', {
            ...props,
            targetArn: props.connectInstance.attrArn,
        });

        this.phoneNumberAssociation = new PhoneNumberContactFlowAssociation(this, 'phoneNumberAssociation', {
            connectInstanceId: props.connectInstance.attrId,
            phoneNumberId: this.phoneNumber.ref,
            contactFlowId: props.contactFlow.ref,
        });

    }

}
