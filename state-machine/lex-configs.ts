import {CustomizedBotLocaleProperty} from "../infra";

const yesNoBotConfig = {
    nluConfidenceThreshold: 0.75,
    intents: {
        "Yes": {
            sampleUtterances: ['yes', 'yeah', 'right', 'okay'],
        },
        "No": {
            sampleUtterances: ['no', 'nah', 'nope'],
        },
        "FallbackIntent": {
            parentIntentSignature: "AMAZON.FallbackIntent",
        },
    },
} as const; // TODO Move to 'satisfies' keyword in TS 4.9

// type yesNoIntents = keyof (typeof yesNoBotConfig)["intents"];
//
// type Intents<Bot extends CustomizedBotLocaleProperty> = keyof Bot["intents"];
//
// const joey: Intents<typeof yesNoBotConfig> = "Yes";

const ticTacToeBotConfig = {
    nluConfidenceThreshold: 0.75,
    slotTypes: [
        {
            name: "TileNumber",
            parentSlotTypeSignature: "AMAZON.AlphaNumeric",
            valueSelectionSetting: {
                regexFilter: {
                    pattern: "[1-9]"
                },
                resolutionStrategy: "ORIGINAL_VALUE"
            },
        },
    ],
    intents: {
        "Board": {
            sampleUtterances: ['tiles', 'current board', 'board', 'readout'],
        },
        "SelectTile": {
            sampleUtterances: ['{tile}'],
            slots: [
                {
                    name: 'tile',
                    slotTypeName: "TileNumber",
                    valueElicitationSetting: {
                        slotConstraint: "Required",
                        promptSpecification: {
                            messageGroupsList: [
                                {
                                    message: {
                                        plainTextMessage: {
                                            value: "This text should never be heard."
                                        },
                                    },
                                }
                            ],
                            maxRetries: 1,
                            allowInterrupt: true
                        },
                    }
                },
            ],
            slotPriorities: [
                {
                    slotName: 'tile',
                    priority: 0
                }
            ],
        },
        "FallbackIntent": {
            parentIntentSignature: "AMAZON.FallbackIntent",
        },
    },
}

// type ticTacToeIntents = keyof (typeof ticTacToeBotConfig)["intents"];
// type ticTacToeTileSlots = (typeof ticTacToeBotConfig)["intents"]["SelectTile"];