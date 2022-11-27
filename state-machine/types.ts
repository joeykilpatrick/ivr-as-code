import type {StateMachineSession} from "./session";
import {IsNumber, IsString, IsOptional} from 'class-validator';
import {AttributeHolder} from "./attributes";

export type StateHandler = (session: StateMachineSession) => (StateResponse | Promise<StateResponse>);
export type LexBotResponseHandler<T extends (keyof LexBotIntentMap) & LexBot> = (session: StateMachineSession, lexBotResult: LexBotResult<T>, attempt: number) => StateResponse;

export type StateMachine<T extends string = string> =
    (new () => Object)
    & Omit<Partial<Record<T, StateHandler | LexBotResponseHandler<any>>>, "prototype">

export interface StateMachinePositionState {
    machine: string,
    state: string,
}

export type StateMachinePosition =
    | {type: "STATE"} & StateMachinePositionState
    | {type: "LEXBOT_RESPONSE_HANDLER", config: LexBotConfig, handlerState: StateMachinePositionState, outOfAttemptsState: StateMachinePositionState, attempt: number}

export interface SessionData {
    stateMachineStack: StateMachinePosition[];
    attributes: AttributeHolder;
}

export type NextStateResponse = {
    nextPosition: StateMachinePositionState;
}

export type ConnectAttributeMap = Record<string, string>;

type LexBotOptions = {
    MACH_BARGE_IN: "true" | "false",
    MACH_DTMF_TIMEOUT_MS: string, // number string
}

export enum Voice {
    SALLI = "Salli",
    JOANNA = "Joanna",
    MATTHEW = "Matthew",
    IVY = "Ivy", // Child
    JUSTIN = "Justin", // Child
    KENDRA = "Kendra",
    KIMBERLY = "Kimberly",
    JOEY = "Joey",
}

type LoggingOption = "Enable" | "Disable";
type StreamingOption = "Start" | "Stop";

type ContinuableLambdaResponse = {
    MACH_SESSION: string
}

export type StateResponse =
    | {command: "HANGUP"}
    | {command: "ERROR"}
    | {command: "QUEUE", queueName: string, queueFlowName: string}
    | {command: "PHONE", phoneNumber: string}
    | {command: "PROMPT", ssml: string} & NextStateResponse
    | {command: "LEXBOT", config: LexBotConfig, handlerState: StateMachinePositionState, outOfAttemptsState: StateMachinePositionState}
    | {command: "RETRY", config?: Partial<LexBotConfig>}
    | {command: "ATTRIBUTE", key: string, value: string} & NextStateResponse
    | {command: "VOICE", voice: Voice} & NextStateResponse
    | {command: "LOGGING", logging: LoggingOption} & NextStateResponse
    | {command: "STREAMING", streaming: StreamingOption} & NextStateResponse
    | {command: "PUSH", pushedPosition: StateMachinePositionState} & NextStateResponse
    | {command: "POP"}
    | {command: "CONTINUE"} & NextStateResponse

export type EngineResponse =
    | {command: "HANGUP"}
    | {command: "ERROR"}
    | {command: "QUEUE", queueName: string, queueFlowName: string}
    | {command: "PHONE", phoneNumber: string}
    | {command: "PROMPT", ssml: string}
    | {command: "LEXBOT", config: LexBotConfig}
    | {command: "ATTRIBUTE", key: string, value: string}
    | {command: "VOICE", voice: Voice}
    | {command: "LOGGING", logging: LoggingOption}
    | {command: "STREAMING", streaming: StreamingOption}

export type LambdaResponse =
    | {MACH_ROUTE_COMMAND: "HANGUP"}
    | {MACH_ROUTE_COMMAND: "ERROR"}
    | {MACH_ROUTE_COMMAND: "QUEUE", MACH_ROUTE_DESTINATION: string, MACH_QUEUE_FLOW: string}
    | {MACH_ROUTE_COMMAND: "PHONE", MACH_ROUTE_DESTINATION: string}
    | {MACH_ROUTE_COMMAND: "LEXBOT", MACH_ROUTE_DESTINATION: string, MACH_SPOKEN_TEXT_SSML: string} & LexBotOptions & ContinuableLambdaResponse
    | {MACH_ROUTE_COMMAND: "PROMPT", MACH_SPOKEN_TEXT_SSML: string} & ContinuableLambdaResponse
    | {MACH_ROUTE_COMMAND: "ATTRIBUTE", MACH_ATTRIBUTE_KEY: string, MACH_ATTRIBUTE_VALUE: string} & ContinuableLambdaResponse
    | {MACH_ROUTE_COMMAND: "VOICE", MACH_ROUTE_DESTINATION: Voice} & ContinuableLambdaResponse
    | {MACH_ROUTE_COMMAND: "LOGGING", MACH_ROUTE_DESTINATION: LoggingOption} & ContinuableLambdaResponse
    | {MACH_ROUTE_COMMAND: "STREAMING", MACH_ROUTE_DESTINATION: StreamingOption} & ContinuableLambdaResponse

export enum LexBot {
    MAIN_MENU = "arn:aws:lex:us-east-1:143570854108:bot-alias/NV1HBK9SI7/CLNKTSGU1J",
    TIC_TAC_TOE = "arn:aws:lex:us-east-1:143570854108:bot-alias/BBEK0DQPRJ/R9FLHX5LID",
    YES_NO = "arn:aws:lex:us-east-1:143570854108:bot-alias/JFFQZH34RA/DMMHS1RWCQ",
}

export enum LexIntent {
    PLAY_TIC_TAC_TOE = "PlayTicTacToe",
    TRANSFER_TO_JOEY = "TransferToJoey",
    BOARD = "Board",
    SELECT_TILE = "SelectTile",
    FALLBACK = "FallbackIntent",
    YES = "Yes",
    NO = "No",
}

export interface LexBotIntentMap {
    [LexBot.MAIN_MENU]:
        | LexIntent.PLAY_TIC_TAC_TOE
        | LexIntent.TRANSFER_TO_JOEY
        | LexIntent.FALLBACK
    [LexBot.TIC_TAC_TOE]:
        | LexIntent.BOARD
        | LexIntent.SELECT_TILE
        | LexIntent.FALLBACK
    [LexBot.YES_NO]:
        | LexIntent.YES
        | LexIntent.NO
        | LexIntent.FALLBACK
}

export interface LexBotSlotMap {
    [LexIntent.SELECT_TILE]: {
        tile: string
    }
}

export class LexBotResult<T extends LexBot, I extends LexBotIntentMap[T] & LexIntent = LexBotIntentMap[T] & LexIntent> {

    @IsString()
    intent!: I; // TODO Validate intent is on that bot

    @IsString()
    inputTranscript!: string;

    slots!: I extends keyof LexBotSlotMap ? LexBotSlotMap[I] : undefined

    getSlots<I>() {
        return this.slots as unknown as I extends keyof LexBotSlotMap ? LexBotSlotMap[I] : undefined;
    }
}

export interface LexBotConfig {
    lexBot: LexBot,
    ssml: string,
    bargeIn: boolean,
    dtmfTimeoutMs: number
    attempts: number,
}

