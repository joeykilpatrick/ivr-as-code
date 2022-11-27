import type { LexV2Result, LexV2Intent, LexV2Interpretation } from 'aws-lambda';

import { LexIntentHandler } from "../LexIntentHandler";

export class EmptySlotsHandler extends LexIntentHandler {

    canHandle(): boolean {
        return Object.entries(this.event.sessionState.intent.slots).some(([_key, value]) => !value || !value.value.interpretedValue);
    }

    private static isIntentComplete(intent: LexV2Intent): boolean {
        return Object.values(intent.slots).every((slot) => {
            return slot && slot.value.interpretedValue;
        });
    }

    bestIntentWithAllSlots(): LexV2Result {
        const sortedInterpretations: LexV2Interpretation[] = this.event.interpretations.sort((a, b) => {
            return (b.nluConfidence || 0) - (a.nluConfidence || 0)
        });

        console.log({sortedInterpretations, topCompleteIntentJson: JSON.stringify(sortedInterpretations)});

        const topCompleteIntent: LexV2Intent | undefined = sortedInterpretations
            .filter((interp) => (interp.nluConfidence || 0) >= 0.9)
            .map((interp) => interp.intent)
            .find(EmptySlotsHandler.isIntentComplete);

        console.log({topCompleteIntent, topCompleteIntentJson: JSON.stringify(topCompleteIntent)});

        if (topCompleteIntent) {
            this.event.sessionState.intent = topCompleteIntent;
        } else {
            this.event.sessionState.intent = {
                name: "FallbackIntent",
                state: 'Fulfilled',
                confirmationState: "None",
                slots: {},
            };
        }

        return this.close();
    }

    handleDialog = this.bestIntentWithAllSlots;

    handleFulfillment = this.bestIntentWithAllSlots;

}
