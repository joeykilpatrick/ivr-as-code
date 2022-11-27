import {StateMachineSession} from "./session";
import {
    EngineResponse, LexBot, LexBotConfig, LexBotResponseHandler,
    StateHandler,
    StateMachine,
    StateMachinePosition, StateMachinePositionState,
    StateResponse
} from "./types";
import {InitialStateSymbol, StateMachineNameSymbol, StateNameSymbol} from "./decorators";

export class StateMachineEngine {

    private static initialMachine: StateMachine | undefined;

    private static machines: Partial<Record<string, StateMachine>> = {};

    public static addInitialMachine(machine: StateMachine): void {
        if (StateMachineEngine.initialMachine) {
            throw Error("An initial state machine is already set. Only one class can be annotated @InitialMachine.");
        }
        StateMachineEngine.initialMachine = machine;
    }

    public static addMachine(name: string, machine: StateMachine): void {
        this.machines[name] = machine;
    }

    private static getInitialPosition(): StateMachinePosition {
        if (!this.initialMachine) {
            throw Error("No initial state machine is defined. One class must be annotated @InitialMachine")
        }
        const initialStateName: string | undefined = Reflect.getOwnMetadata(InitialStateSymbol, this.initialMachine);
        if (!initialStateName) {
            throw Error("No initial state on the initial state machine. One method must be annotated @InitialState");
        }
        const stateHandler = this.initialMachine[initialStateName];
        if (!stateHandler) {
            throw Error("The initial state name was not found on the initial state machine.");
        }
        const stateMachineName: string | undefined = Reflect.getOwnMetadata(StateMachineNameSymbol, stateHandler);
        const stateMachineStateName: string | undefined = Reflect.getOwnMetadata(StateNameSymbol, stateHandler);
        if (!stateMachineName) {
            throw Error("The state machine name was not found on the initial state machine state handler.");
        }
        if (!stateMachineStateName) {
            throw Error("The state name was not found on the initial state machine state handler.");
        }
        return {
            type: "STATE",
            machine: stateMachineName,
            state: stateMachineStateName
        }
    }

    static getStateHandler(position: StateMachinePositionState): StateHandler {
        // Lookup the state machine constructor in this.machines
        const machineConstructor = this.machines[position.machine];
        if (!machineConstructor) {
            throw Error(`Unknown StateMachine name: "${position.machine}"`);
        }

        // Get the static handler from the state machine constructor
        if (!machineConstructor[position.state]) {
            throw Error(`No StateHandler "${position.state}" found on StateMachine "${position.machine}"`);
        }

        return (session) => {
            return (machineConstructor[position.state] as StateHandler)(session)
        }
    }

    static getLexBotResponseHandler(position: StateMachinePositionState): LexBotResponseHandler<LexBot> {
        // Lookup the state machine constructor in this.machines
        const machineConstructor = this.machines[position.machine];
        if (!machineConstructor) {
            throw Error(`Unknown StateMachine name: "${position.machine}"`);
        }

        // Get the static handler from the state machine constructor
        if (!machineConstructor[position.state]) {
            throw Error(`No StateHandler "${position.state}" found on StateMachine "${position.machine}"`);
        }

        return (session, intent, attempt) => {
            return (machineConstructor[position.state] as LexBotResponseHandler<LexBot>)(session, intent, attempt)
        }
    }

    public static async run(session: StateMachineSession): Promise<EngineResponse> {
        const position: StateMachinePosition = (() => {
            const topPosition: StateMachinePosition | undefined = session.popPosition();
            return topPosition || this.getInitialPosition();
        })()

        const response: StateResponse = await (async () => {
            switch (position.type) {
                case "STATE":
                    return this.getStateHandler(position)(session);
                case "LEXBOT_RESPONSE_HANDLER":
                    const handlerResponse = this.getLexBotResponseHandler(position.handlerState)(session, session.lexBotResult!, position.attempt);
                    if (handlerResponse.command === "RETRY" && position.attempt >= position.config.attempts) {
                        return this.getStateHandler(position.outOfAttemptsState)(session);
                    }
                    return handlerResponse;
            }
        })()

        // console.log({response});

        switch (response.command) {
            case "HANGUP":
            case "ERROR":
            case "QUEUE":
            case "PHONE":
                return response
            case "PROMPT":
            case "ATTRIBUTE":
            case "VOICE":
            case "LOGGING":
            case "STREAMING":
                session.pushState(response.nextPosition);
                return response;
            case "LEXBOT":
                session.pushPosition({
                    type: "LEXBOT_RESPONSE_HANDLER",
                    config: response.config,
                    handlerState: response.handlerState,
                    outOfAttemptsState: response.outOfAttemptsState,
                    attempt: 1,
                })
                return response;
            case "PUSH":
                session.pushState(response.nextPosition);
                session.pushState(response.pushedPosition);
                return this.run(session);
            case "POP":
                return this.run(session);
            case "CONTINUE":
                session.pushState(response.nextPosition);
                return this.run(session);
            case "RETRY":
                switch (position.type) {
                    case "STATE":
                        throw Error("Cannot retry a state, can only retry a lex bot response handler.");
                    case "LEXBOT_RESPONSE_HANDLER":
                        const newConfig: LexBotConfig = {
                            ...position.config,
                            ...response.config,
                        }
                        session.pushPosition({
                            ...position,
                            config: newConfig,
                            attempt: position.attempt + 1,
                        })
                        return {command: "LEXBOT", config: newConfig};
                }
        }
    }
}