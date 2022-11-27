import {LexIntentHandler} from "../LexIntentHandler";

export class FallbackHandler extends LexIntentHandler {

    canHandle(): boolean {
        return true;
    }

    handleDialog = this.close

    handleFulfillment = this.close;
}