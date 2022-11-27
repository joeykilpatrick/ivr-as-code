export function generateContactFlowContent(lambdaArn: string): string {
    return JSON.stringify({
        Version: "2019-10-30",
        StartAction: "8b02a52e-fa88-48e4-aef8-af0a16177793",
        Metadata: {
            entryPointPosition: {x: 15, y: 927},
            snapToGrid: false,
            ActionMetadata: {
                "829b3a6c-e460-44cb-b30f-3187522ac6da": {position: {x: 1989, y: 100}, useDynamic: false},
                "86f1a150-e9a3-48f0-a3f9-cf8f5d755489": {
                    position: {x: 1756, y: 109},
                    useDynamic: true,
                    queue: "MACH_ROUTE_DESTINATION"
                },
                "7c2322ae-b80e-45fd-ab2f-095b9ad63176": {position: {x: 1516, y: 15}},
                "fbb7bd12-e80e-4235-a3bd-6db6de2da32c": {
                    position: {x: 1522, y: 149},
                    contactFlow: "MACH_QUEUE_FLOW",
                    customerOrAgent: true,
                    useDynamic: true
                },
                "702dbbb9-6437-4dee-a359-07abbda6d0ed": {position: {x: 1541, y: 1731}, useDynamic: true},
                "2bd18453-9486-45f6-9ca1-9c5cbb23ba5a": {
                    position: {x: 1532, y: 1915},
                    overrideConsoleVoice: false,
                    defaultVoice: "Standard"
                },
                "e31d17a7-9241-465e-bcab-b47cce01732a": {
                    position: {x: 1549, y: 1511},
                    dynamicParams: ["$.Attributes.MACH_ATTRIBUTE_KEY"]
                },
                "2cf69606-6542-4146-a917-7941c77e2780": {position: {x: 1817, y: 1120}},
                "395bf7c8-c147-4fff-98c4-e80ba800d9be": {position: {x: 1833, y: 1281}},
                "07c67ebc-8366-40fe-8cfa-9e48682e1392": {
                    position: {x: 1560, y: 1252},
                    conditionMetadata: [{
                        operator: {name: "Equals", value: "Equals", shortDisplay: "="},
                        value: "Enable",
                        id: "24d4fc65-6b93-47a9-8bc5-c31e07519035"
                    }, {
                        operator: {name: "Equals", value: "Equals", shortDisplay: "="},
                        value: "Disable",
                        id: "2f3f582f-9aa2-4cb7-a8f8-5aa43aa47e58"
                    }]
                },
                "a6ca5930-8b14-4730-9708-b11f0713d060": {
                    position: {x: 1817, y: 491},
                    dynamicParams: ["MACH_LEXBOT_RESULT"]
                },
                "4010801b-fd51-4b04-9ced-ecebc48846a4": {
                    position: {x: 1543, y: 538},
                    conditionMetadata: [],
                    useDynamic: true,
                    dynamicMetadata: {
                        "x-amz-lex:barge-in-enabled:*:*": true,
                        "x-amz-lex:dtmf:end-timeout-ms:*:*": true
                    },
                    useDynamicLexBotArn: false
                },
                "caaccc91-c369-4343-941f-32da00ddc4e2": {position: {x: 2797, y: 426}},
                "a36eef43-dc6a-43c5-bee1-980fce817600": {position: {x: 1823, y: 902}},
                "6fa11be8-515c-4427-9072-f946a3d288ac": {position: {x: 2035, y: 2368}, useDynamic: false},
                "735086db-0b3a-4d46-848b-d73c38d9c44b": {
                    position: {x: 1555, y: 905},
                    conditionMetadata: [{
                        operator: {name: "Equals", value: "Equals", shortDisplay: "="},
                        value: "Start",
                        id: "1a3a47d4-098f-4cdb-985e-1c7edd98818e"
                    }, {
                        operator: {name: "Equals", value: "Equals", shortDisplay: "="},
                        value: "Stop",
                        id: "1c05fb20-7e7b-4794-b5da-f3b13d7d7926"
                    }]
                },
                "fa859c63-5097-42e1-9893-991ecca470ab": {
                    position: {x: 1813.5322265625, y: 705.7548217773438},
                    fromCustomer: true,
                    toCustomer: true
                },
                "b2161ec3-7444-44bc-8b53-b97c29796be8": {position: {x: 2567, y: 362}, useDynamic: false},
                "042bbc95-ccf0-4aa3-9ad9-ecb8c4641a6f": {
                    position: {x: 1095, y: 899},
                    conditionMetadata: [{
                        operator: {name: "Equals", value: "Equals", shortDisplay: "="},
                        value: "HANGUP",
                        id: "29dcb06f-70bb-4806-80f1-6a5c03692d67"
                    }, {
                        operator: {name: "Equals", value: "Equals", shortDisplay: "="},
                        value: "QUEUE",
                        id: "996e0519-d189-47b8-a4e3-7e55fd4d8877"
                    }, {
                        operator: {name: "Equals", value: "Equals", shortDisplay: "="},
                        value: "PHONE",
                        id: "117ba355-6b13-46bc-b9c0-a6b0e83a528c"
                    }, {
                        operator: {name: "Equals", value: "Equals", shortDisplay: "="},
                        value: "LEXBOT",
                        id: "33ad662d-1315-4a70-94e3-938445250c9b"
                    }, {
                        operator: {name: "Equals", value: "Equals", shortDisplay: "="},
                        value: "STREAMING",
                        id: "ca8faaf5-8a98-4433-b927-7859546fa65a"
                    }, {
                        operator: {name: "Equals", value: "Equals", shortDisplay: "="},
                        value: "LOGGING",
                        id: "122f24d8-ef53-4c87-af75-811ace133b48"
                    }, {
                        operator: {name: "Equals", value: "Equals", shortDisplay: "="},
                        value: "ATTRIBUTE",
                        id: "3d71ab71-0c5f-4520-9d33-62ea8177e6bc"
                    }, {
                        operator: {name: "Equals", value: "Equals", shortDisplay: "="},
                        value: "PROMPT",
                        id: "e31ff5fc-4728-429f-80ae-2b4d5c4f103d"
                    }, {
                        operator: {name: "Equals", value: "Equals", shortDisplay: "="},
                        value: "VOICE",
                        id: "8ae6570a-0967-44ea-9617-f3ad836aecbe"
                    }, {
                        operator: {name: "Equals", value: "Equals", shortDisplay: "="},
                        value: "ERROR",
                        id: "05a268c3-dd23-434a-9168-4927bfaee44b"
                    }]
                },
                "87f764bf-33c3-44eb-b885-0ab299fced88": {position: {x: 1532, y: 353}},
                "332fb9e0-263e-49e7-86f4-6a8693110bb0": {
                    position: {x: 826, y: 900},
                    dynamicParams: ["MACH_ROUTE_COMMAND", "MACH_ROUTE_DESTINATION", "MACH_QUEUE_FLOW", "MACH_SPOKEN_TEXT_SSML", "MACH_BARGE_IN", "MACH_SESSION", "MACH_ATTRIBUTE_KEY", "MACH_ATTRIBUTE_VALUE", "MACH_LEXBOT_RESULT", "MACH_DTMF_TIMEOUT_MS"]
                },
                "18333802-84d4-4dd1-a811-5ac284bcfcf9": {position: {x: 1081, y: 2113}, useDynamic: false},
                "c0b9e295-066b-41f8-854e-65078149c782": {position: {x: 212, y: 2363}, useDynamic: false},
                "8b02a52e-fa88-48e4-aef8-af0a16177793": {position: {x: 237, y: 929}},
                "39040159-be2c-42bc-8dce-920cb39931a5": {
                    position: {x: 517, y: 903.3673965936739},
                    dynamicMetadata: {},
                    useDynamic: false
                }
            }
        },
        Actions: [
            {
            Identifier: "829b3a6c-e460-44cb-b30f-3187522ac6da",
            Transitions: {
                NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8",
                Errors: [{
                    NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8",
                    ErrorType: "NoMatchingError"
                }, {NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8", ErrorType: "QueueAtCapacity"}],
                Conditions: []
            },
            Type: "TransferContactToQueue"
        }, {
            Identifier: "86f1a150-e9a3-48f0-a3f9-cf8f5d755489",
            Parameters: {QueueId: "$.Attributes.MACH_ROUTE_DESTINATION"},
            Transitions: {
                NextAction: "829b3a6c-e460-44cb-b30f-3187522ac6da",
                Errors: [{NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8", ErrorType: "NoMatchingError"}],
                Conditions: []
            },
            Type: "UpdateContactTargetQueue"
        }, {
            Identifier: "7c2322ae-b80e-45fd-ab2f-095b9ad63176",
            Type: "DisconnectParticipant",
            Parameters: {},
            Transitions: {}
        }, {
            Identifier: "fbb7bd12-e80e-4235-a3bd-6db6de2da32c",
            Parameters: {EventHooks: {CustomerQueue: "$.Attributes.MACH_QUEUE_FLOW"}},
            Transitions: {
                NextAction: "86f1a150-e9a3-48f0-a3f9-cf8f5d755489",
                Errors: [{NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8", ErrorType: "NoMatchingError"}],
                Conditions: []
            },
            Type: "UpdateContactEventHooks"
        }, {
            Identifier: "702dbbb9-6437-4dee-a359-07abbda6d0ed",
            Parameters: {SSML: "$.Attributes.MACH_SPOKEN_TEXT_SSML"},
            Transitions: {NextAction: "6fa11be8-515c-4427-9072-f946a3d288ac", Errors: [], Conditions: []},
            Type: "MessageParticipant"
        }, {
            Identifier: "2bd18453-9486-45f6-9ca1-9c5cbb23ba5a",
            Parameters: {
                TextToSpeechVoice: "Joanna",
                // TextToSpeechVoice: "$.Attributes.MACH_ROUTE_DESTINATION", // TODO Setting with attribute doesn't appear possible in the JSON, but is in the flow editor
                TextToSpeechEngine: "Neural",
                TextToSpeechStyle: "None"
            },
            Transitions: {NextAction: "6fa11be8-515c-4427-9072-f946a3d288ac", Errors: [], Conditions: []},
            Type: "UpdateContactTextToSpeechVoice"
        }, {
            Identifier: "e31d17a7-9241-465e-bcab-b47cce01732a",
            Parameters: {Attributes: {"$.Attributes.MACH_ATTRIBUTE_KEY": "$.Attributes.MACH_ATTRIBUTE_VALUE"}},
            Transitions: {
                NextAction: "6fa11be8-515c-4427-9072-f946a3d288ac",
                Errors: [{NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8", ErrorType: "NoMatchingError"}],
                Conditions: []
            },
            Type: "UpdateContactAttributes"
        }, {
            Identifier: "2cf69606-6542-4146-a917-7941c77e2780",
            Parameters: {FlowLoggingBehavior: "Enabled"},
            Transitions: {NextAction: "6fa11be8-515c-4427-9072-f946a3d288ac", Errors: [], Conditions: []},
            Type: "UpdateFlowLoggingBehavior"
        }, {
            Identifier: "395bf7c8-c147-4fff-98c4-e80ba800d9be",
            Parameters: {FlowLoggingBehavior: "Disabled"},
            Transitions: {NextAction: "6fa11be8-515c-4427-9072-f946a3d288ac", Errors: [], Conditions: []},
            Type: "UpdateFlowLoggingBehavior"
        }, {
            Identifier: "07c67ebc-8366-40fe-8cfa-9e48682e1392",
            Parameters: {ComparisonValue: "$.Attributes.MACH_ROUTE_DESTINATION"},
            Transitions: {
                NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8",
                Errors: [{NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8", ErrorType: "NoMatchingCondition"}],
                Conditions: [{
                    NextAction: "2cf69606-6542-4146-a917-7941c77e2780",
                    Condition: {Operator: "Equals", Operands: ["Enable"]}
                }, {
                    NextAction: "395bf7c8-c147-4fff-98c4-e80ba800d9be",
                    Condition: {Operator: "Equals", Operands: ["Disable"]}
                }]
            },
            Type: "Compare"
        }, {
            Identifier: "a6ca5930-8b14-4730-9708-b11f0713d060",
            Parameters: {Attributes: {MACH_LEXBOT_RESULT: "$.Lex.SessionAttributes.MACH_LEXBOT_RESULT"}},
            Transitions: {
                NextAction: "6fa11be8-515c-4427-9072-f946a3d288ac",
                Errors: [{NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8", ErrorType: "NoMatchingError"}],
                Conditions: []
            },
            Type: "UpdateContactAttributes"
        }, {
            Identifier: "4010801b-fd51-4b04-9ced-ecebc48846a4",
            Parameters: {
                SSML: "$.Attributes.MACH_SPOKEN_TEXT_SSML",
                LexSessionAttributes: {
                    "x-amz-lex:dtmf:end-timeout-ms:*:*": "$.Attributes.MACH_DTMF_TIMEOUT_MS",
                    "x-amz-lex:barge-in-enabled:*:*": "$.Attributes.MACH_BARGE_IN"
                },
                "LexV2Bot": {
                    AliasArn: "$.Attributes.MACH_ROUTE_DESTINATION"
                }
            },
            Transitions: {
                NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8",
                Errors: [{
                    NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8",
                    ErrorType: "NoMatchingError"
                }, {NextAction: "a6ca5930-8b14-4730-9708-b11f0713d060", ErrorType: "NoMatchingCondition"}],
                Conditions: []
            },
            Type: "ConnectParticipantWithLexBot"
        }, {
            Identifier: "caaccc91-c369-4343-941f-32da00ddc4e2",
            Type: "DisconnectParticipant",
            Parameters: {},
            Transitions: {}
        }, {
            Identifier: "a36eef43-dc6a-43c5-bee1-980fce817600",
            Parameters: {
                MediaStreamingState: "Disabled",
                MediaStreamType: "Audio",
                Participants: [{ParticipantType: "Customer", MediaDirections: ["From", "To"]}]
            },
            Transitions: {
                NextAction: "6fa11be8-515c-4427-9072-f946a3d288ac",
                Errors: [{NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8", ErrorType: "NoMatchingError"}],
                Conditions: []
            },
            Type: "UpdateContactMediaStreamingBehavior"
        }, {
            Identifier: "6fa11be8-515c-4427-9072-f946a3d288ac",
            Parameters: {LoopCount: "0"},
            Transitions: {
                NextAction: "c0b9e295-066b-41f8-854e-65078149c782",
                Errors: [],
                Conditions: [{
                    NextAction: "c0b9e295-066b-41f8-854e-65078149c782",
                    Condition: {Operator: "Equals", Operands: ["DoneLooping"]}
                }, {
                    NextAction: "c0b9e295-066b-41f8-854e-65078149c782",
                    Condition: {Operator: "Equals", Operands: ["ContinueLooping"]}
                }]
            },
            Type: "Loop"
        }, {
            Identifier: "735086db-0b3a-4d46-848b-d73c38d9c44b",
            Parameters: {ComparisonValue: "$.Attributes.MACH_ROUTE_DESTINATION"},
            Transitions: {
                NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8",
                Errors: [{NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8", ErrorType: "NoMatchingCondition"}],
                Conditions: [{
                    NextAction: "fa859c63-5097-42e1-9893-991ecca470ab",
                    Condition: {Operator: "Equals", Operands: ["Start"]}
                }, {
                    NextAction: "a36eef43-dc6a-43c5-bee1-980fce817600",
                    Condition: {Operator: "Equals", Operands: ["Stop"]}
                }]
            },
            Type: "Compare"
        }, {
            Identifier: "fa859c63-5097-42e1-9893-991ecca470ab",
            Parameters: {
                MediaStreamingState: "Enabled",
                MediaStreamType: "Audio",
                Participants: [{ParticipantType: "Customer", MediaDirections: ["From", "To"]}]
            },
            Transitions: {
                NextAction: "6fa11be8-515c-4427-9072-f946a3d288ac",
                Errors: [{NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8", ErrorType: "NoMatchingError"}],
                Conditions: []
            },
            Type: "UpdateContactMediaStreamingBehavior"
        }, {
            Identifier: "b2161ec3-7444-44bc-8b53-b97c29796be8",
            Parameters: {Text: "There has been an error. You will now be disconnected."},
            Transitions: {NextAction: "caaccc91-c369-4343-941f-32da00ddc4e2", Errors: [], Conditions: []},
            Type: "MessageParticipant"
        }, {
            Identifier: "042bbc95-ccf0-4aa3-9ad9-ecb8c4641a6f",
            Parameters: {ComparisonValue: "$.Attributes.MACH_ROUTE_COMMAND"},
            Transitions: {
                NextAction: "18333802-84d4-4dd1-a811-5ac284bcfcf9",
                Errors: [{NextAction: "18333802-84d4-4dd1-a811-5ac284bcfcf9", ErrorType: "NoMatchingCondition"}],
                Conditions: [{
                    NextAction: "7c2322ae-b80e-45fd-ab2f-095b9ad63176",
                    Condition: {Operator: "Equals", Operands: ["HANGUP"]}
                }, {
                    NextAction: "fbb7bd12-e80e-4235-a3bd-6db6de2da32c",
                    Condition: {Operator: "Equals", Operands: ["QUEUE"]}
                }, {
                    NextAction: "87f764bf-33c3-44eb-b885-0ab299fced88",
                    Condition: {Operator: "Equals", Operands: ["PHONE"]}
                }, {
                    NextAction: "4010801b-fd51-4b04-9ced-ecebc48846a4",
                    Condition: {Operator: "Equals", Operands: ["LEXBOT"]}
                }, {
                    NextAction: "735086db-0b3a-4d46-848b-d73c38d9c44b",
                    Condition: {Operator: "Equals", Operands: ["STREAMING"]}
                }, {
                    NextAction: "07c67ebc-8366-40fe-8cfa-9e48682e1392",
                    Condition: {Operator: "Equals", Operands: ["LOGGING"]}
                }, {
                    NextAction: "e31d17a7-9241-465e-bcab-b47cce01732a",
                    Condition: {Operator: "Equals", Operands: ["ATTRIBUTE"]}
                }, {
                    NextAction: "702dbbb9-6437-4dee-a359-07abbda6d0ed",
                    Condition: {Operator: "Equals", Operands: ["PROMPT"]}
                }, {
                    NextAction: "2bd18453-9486-45f6-9ca1-9c5cbb23ba5a",
                    Condition: {Operator: "Equals", Operands: ["VOICE"]}
                }, {
                    NextAction: "18333802-84d4-4dd1-a811-5ac284bcfcf9",
                    Condition: {Operator: "Equals", Operands: ["ERROR"]}
                }]
            },
            Type: "Compare"
        }, {
            Identifier: "87f764bf-33c3-44eb-b885-0ab299fced88",
            Parameters: {
                ThirdPartyPhoneNumber: "$.Attributes.MACH_ROUTE_DESTINATION",
                ThirdPartyConnectionTimeLimitSeconds: "30",
                ContinueFlowExecution: "False"
            },
            Transitions: {
                NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8",
                Errors: [{NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8", ErrorType: "NoMatchingError"}],
                Conditions: []
            },
            Type: "TransferParticipantToThirdParty"
        }, {
            Identifier: "332fb9e0-263e-49e7-86f4-6a8693110bb0",
            Parameters: {
                Attributes: {
                    MACH_QUEUE_FLOW: "$.External.MACH_QUEUE_FLOW",
                    MACH_SESSION: "$.External.MACH_SESSION",
                    MACH_ATTRIBUTE_KEY: "$.External.MACH_ATTRIBUTE_KEY",
                    MACH_ATTRIBUTE_VALUE: "$.External.MACH_ATTRIBUTE_VALUE",
                    MACH_LEXBOT_RESULT: "$.External.MACH_LEXBOT_RESULT",
                    MACH_ROUTE_COMMAND: "$.External.MACH_ROUTE_COMMAND",
                    MACH_BARGE_IN: "$.External.MACH_BARGE_IN",
                    MACH_DTMF_TIMEOUT_MS: "$.External.MACH_DTMF_TIMEOUT_MS",
                    MACH_ROUTE_DESTINATION: "$.External.MACH_ROUTE_DESTINATION",
                    MACH_SPOKEN_TEXT_SSML: "$.External.MACH_SPOKEN_TEXT_SSML"
                }
            },
            Transitions: {
                NextAction: "042bbc95-ccf0-4aa3-9ad9-ecb8c4641a6f",
                Errors: [{NextAction: "18333802-84d4-4dd1-a811-5ac284bcfcf9", ErrorType: "NoMatchingError"}],
                Conditions: []
            },
            Type: "UpdateContactAttributes"
        }, {
            Identifier: "18333802-84d4-4dd1-a811-5ac284bcfcf9",
            Parameters: {LoopCount: "0"},
            Transitions: {
                NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8",
                Errors: [],
                Conditions: [{
                    NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8",
                    Condition: {Operator: "Equals", Operands: ["DoneLooping"]}
                }, {
                    NextAction: "b2161ec3-7444-44bc-8b53-b97c29796be8",
                    Condition: {Operator: "Equals", Operands: ["ContinueLooping"]}
                }]
            },
            Type: "Loop"
        }, {
            Identifier: "c0b9e295-066b-41f8-854e-65078149c782",
            Parameters: {LoopCount: "0"},
            Transitions: {
                NextAction: "39040159-be2c-42bc-8dce-920cb39931a5",
                Errors: [],
                Conditions: [{
                    NextAction: "39040159-be2c-42bc-8dce-920cb39931a5",
                    Condition: {Operator: "Equals", Operands: ["DoneLooping"]}
                }, {
                    NextAction: "39040159-be2c-42bc-8dce-920cb39931a5",
                    Condition: {Operator: "Equals", Operands: ["ContinueLooping"]}
                }]
            },
            Type: "Loop"
        }, {
            Identifier: "8b02a52e-fa88-48e4-aef8-af0a16177793",
            Parameters: {FlowLoggingBehavior: "Enabled"},
            Transitions: {NextAction: "39040159-be2c-42bc-8dce-920cb39931a5", Errors: [], Conditions: []},
            Type: "UpdateFlowLoggingBehavior"
        }, {
            Identifier: "39040159-be2c-42bc-8dce-920cb39931a5",
            Parameters: {
                LambdaFunctionARN: lambdaArn,
                InvocationTimeLimitSeconds: "8"
            },
            Transitions: {
                NextAction: "332fb9e0-263e-49e7-86f4-6a8693110bb0",
                Errors: [{NextAction: "18333802-84d4-4dd1-a811-5ac284bcfcf9", ErrorType: "NoMatchingError"}],
                Conditions: []
            },
            Type: "InvokeLambdaFunction"
        }]
    })
}
