import { LexV2Event, LexV2Result } from "aws-lambda";

import { LexIntentHandler } from "./LexIntentHandler";

export class LexBotHandler {

    private intentHandlers: (new (event: LexV2Event) => LexIntentHandler)[] = [];

    addRequestHandlers(handlers: (new (event: LexV2Event) =>  LexIntentHandler)[]): LexBotHandler {
        this.intentHandlers.push(...handlers);
        return this;
    }

    handler = async (event: LexV2Event): Promise<LexV2Result> => {
        console.log({event, eventJson: JSON.stringify(event)});
        const result: LexV2Result = await (async () => {
            return await this.callIntentHandler(event);
        })()
        console.log({result, resultJson: JSON.stringify(result)});
        return result;
    }


    async callIntentHandler(event: LexV2Event): Promise<LexV2Result> {
        const validHandler = this.intentHandlers.find((handler) => {
            return (new handler(event)).canHandle();
        });
        if (!validHandler) {
            throw Error(`Unable to find handler for ${event.sessionState.intent.name}`);
        }
        return await (new validHandler(event)).handler();
    }
}
