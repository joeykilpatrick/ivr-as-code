import type { LexV2Event, LexV2ResultDialogAction, LexV2Result, LexV2Slots } from "aws-lambda";

import type { LexBot, LexBotResult, LexBotSlotMap, LexIntent } from "../state-machine/types";

export abstract class LexIntentHandler {

    constructor(
        protected event: LexV2Event
    ) {}

    abstract handleDialog(): Promise<LexV2Result> | LexV2Result;

    abstract handleFulfillment(): Promise<LexV2Result> | LexV2Result;

    abstract canHandle(): boolean;

    public async handler(): Promise<LexV2Result> {
        switch (this.event.invocationSource) {
            case 'DialogCodeHook':
                return this.handleDialog();
            case 'FulfillmentCodeHook':
                return this.handleFulfillment();
        }
    }

    protected close(): LexV2Result {
        return this.buildLexResult({ type: 'Close' });
    }

    private convertSlotValueMap(slots: LexV2Slots): Record<string, string | null> {
        return Object.entries(slots).reduce((prev, [slotName, slotValue]) => {
            if (!slotValue) {
                prev[slotName] = null;
                return prev;
            }
            switch (slotValue.shape) {
                case "Scalar":
                    prev[slotName] = slotValue.value.interpretedValue || null;
                    return prev;
                case "List":
                    // TODO This doesn't look right. Also a different property slotValue.values exists
                    prev[slotName] = slotValue.value.interpretedValue || null;
                    return prev;
            }
        }, {} as Record<string, string | null>);
    }

    protected buildLexResult(dialogAction: LexV2ResultDialogAction, machResult?: Omit<LexBotResult<LexBot>, 'getSlots'>): LexV2Result {
        const defaultMachLexbotResult: Omit<LexBotResult<LexBot>, 'getSlots'> = machResult || {
            intent: this.event.sessionState.intent.name as LexIntent, // TODO Validation
            inputTranscript: this.event.inputTranscript,
            slots: this.convertSlotValueMap(this.event.sessionState.intent.slots) as LexBotSlotMap[keyof LexBotSlotMap] // TODO Validation
        };
        return {
            sessionState: {
                sessionAttributes: {
                    "MACH_LEXBOT_RESULT": JSON.stringify(defaultMachLexbotResult)
                },
                dialogAction: dialogAction,
                intent: this.event.sessionState.intent,
            },
        };
    }

}
