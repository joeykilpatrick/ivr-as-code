import type {
    Voice,
    LexBot,
    LexBotConfig,
    LexBotResponseHandler,
    NextStateResponse,
    StateHandler,
    StateMachinePositionState,
    StateResponse
} from "./types";
import {StateMachineNameSymbol, StateNameSymbol} from "./decorators";

function handlerToPosition(nextState: StateHandler | LexBotResponseHandler<any>): StateMachinePositionState {
    return {
        machine: Reflect.getOwnMetadata(StateMachineNameSymbol, nextState), // TODO Error if not there
        state: Reflect.getOwnMetadata(StateNameSymbol, nextState), // TODO Error if not there
    }
}

export function NextState(nextState: StateHandler): {command: "CONTINUE"} & NextStateResponse {
    return {
        command: "CONTINUE",
        nextPosition: handlerToPosition(nextState)
    };
}

export function PlayPrompt(ssml: string) {
    return {
        then(nextState: StateHandler): StateResponse {
            return {
                command: "PROMPT",
                ssml,
                nextPosition: handlerToPosition(nextState)
            };
        }
    }
}

export function InputFromLexBot<L extends LexBot>(
    config: Partial<LexBotConfig> & {lexBot: L, attempts: number, ssml: string},
    handlerState: LexBotResponseHandler<L>,
    outOfAttemptsState: StateHandler
): StateResponse {
    return {
        command: "LEXBOT",
        config: {
            lexBot: config.lexBot,
            ssml: config.ssml,
            attempts: config.attempts,
            bargeIn: config.bargeIn || false,
            dtmfTimeoutMs: config.dtmfTimeoutMs || 5000,
        },
        handlerState: handlerToPosition(handlerState),
        outOfAttemptsState: handlerToPosition(outOfAttemptsState!),
    };
}

export function SetVoice(voice: Voice) {
    return {
        then(nextState: StateHandler): StateResponse {
            return {command: "VOICE", voice, nextPosition: handlerToPosition(nextState)};
        }
    }
}

export const EnableLogging = {
    then(nextState: StateHandler): StateResponse {
        return {command: "LOGGING", logging: "Enable", nextPosition: handlerToPosition(nextState)};
    }
}

export const DisableLogging = {
    then(nextState: StateHandler): StateResponse {
        return {command: "LOGGING", logging: "Disable", nextPosition: handlerToPosition(nextState)};
    }
}

export const StartStreaming = {
    then(nextState: StateHandler): StateResponse {
        return {command: "STREAMING", streaming: "Start", nextPosition: handlerToPosition(nextState)};
    }
}

export const StopStreaming = {
    then(nextState: StateHandler): StateResponse {
        return {command: "STREAMING", streaming: "Stop", nextPosition: handlerToPosition(nextState)};
    }
}

export function Silence(seconds: number) {
    return {
        then(nextState: StateHandler): StateResponse {
            return {command: "PROMPT", ssml: `<break time="${seconds}s"/>`, nextPosition: handlerToPosition(nextState)};
        }
    }
}

export function PushStateMachine(pushedState: StateHandler) {
    return {
        followedBy(nextState: StateHandler): StateResponse {
            return {
                command: "PUSH",
                pushedPosition: handlerToPosition(pushedState),
                nextPosition: handlerToPosition(nextState)
            };
        }
    };
}

export const PopStateMachine: StateResponse = {command: "POP"}

export function TransferToPhone(phoneNumber: string): StateResponse {
    return {
        command: "PHONE",
        phoneNumber
    };
}

export const HangUp: StateResponse = {
    command: "HANGUP"
};

export const Retry: StateResponse & {withConfig: (config: Partial<LexBotConfig>) => StateResponse} = {
    command: "RETRY",

    withConfig(config: Partial<LexBotConfig>) {
        return {command: "RETRY", config}
    }
};