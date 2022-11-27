import type {
    LexBotResponseHandler,
    StateHandler,
    StateMachine,
    LexBot, LexBotIntentMap,
} from "./types";
import {StateMachineEngine} from "./engine";

export const InitialStateSymbol: symbol = Symbol("InitialState");
export const StateMachineNameSymbol: symbol = Symbol("StateMachineName");
export const StateNameSymbol: symbol = Symbol("StateName");

export function InitialMachine<S extends StateMachine<T>, T extends keyof S & string>(constructor: S): void {
    StateMachineEngine.addInitialMachine(constructor);
    StateMachineEngine.addMachine(constructor.name, constructor)
}

export function Machine<S extends StateMachine<T>, T extends keyof S & string>(constructor: S): void {
    StateMachineEngine.addMachine(constructor.name, constructor)
}

export function InitialState<S extends StateMachine<T> & Record<T, StateHandler>, T extends keyof S & string>(constructor: S, propertyKey: T): void {
    // Check if an initial state has already been set
    const existingInitialState: string | undefined = Reflect.getOwnMetadata(InitialStateSymbol, constructor);
    if (existingInitialState) {
        throw Error(`Multiple initial states found for state machine ${constructor.name}`);
    }

    Reflect.defineMetadata(InitialStateSymbol, propertyKey, constructor);
    State(constructor, propertyKey);
}

export function State<S extends StateMachine<T> & Record<T, StateHandler>, T extends keyof S & string>(constructor: S, propertyKey: T): void {
    // Add the state machine and the handler name to metadata on the constructor
    Reflect.defineMetadata(StateMachineNameSymbol, constructor.name, constructor[propertyKey])
    Reflect.defineMetadata(StateNameSymbol, propertyKey, constructor[propertyKey])
}

export function LexBotResponseState<L extends keyof LexBotIntentMap & LexBot>() {
    return <
        S extends StateMachine<T> & Record<T, LexBotResponseHandler<L>>,
        T extends keyof S & string
        >(constructor: S, propertyKey: T) => {
        // @ts-ignore
        State(constructor, propertyKey);
    }
}

