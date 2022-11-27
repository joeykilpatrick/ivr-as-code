import type {ConnectContactFlowEvent} from "aws-lambda";
import {transformAndValidateSync} from 'class-transformer-validator';

import {LexBot, LexBotResult, SessionData, StateMachinePosition, StateMachinePositionState} from "./types";
import {AttributeHolder} from "./attributes";
import {Environment} from "./environment";

export class StateMachineSession {

    static fromEvent(event: ConnectContactFlowEvent, environment: Environment): StateMachineSession {
        const sessionString = event.Details.ContactData.Attributes["MACH_SESSION"] || "{}";
        const sessionObject: Partial<SessionData> = JSON.parse(sessionString); // TODO Real validation

        const validatedLexBotResult: LexBotResult<LexBot> | undefined = (() => {
            const lexBotResultString: string | undefined = event.Details.ContactData.Attributes["MACH_LEXBOT_RESULT"];
            if (!lexBotResultString) {
                return;
            }
            return transformAndValidateSync<LexBotResult<LexBot>>(LexBotResult, JSON.parse(lexBotResultString) as object); // TODO What if it's an array?
        })();

        return new StateMachineSession(
            event,
            environment,
            sessionObject.stateMachineStack || [],
            transformAndValidateSync(AttributeHolder, sessionObject.attributes || {}),
            validatedLexBotResult
        );
    }

    private constructor(
        public readonly event: ConnectContactFlowEvent,
        public readonly environment: Environment,
        private readonly stateMachineStack: StateMachinePosition[],
        public readonly attributes: AttributeHolder,
        public readonly lexBotResult?: LexBotResult<LexBot>,
    ) {}

    /**
     * Return a JSON string of the important session data. This can be cached
     * and reloaded when the machine starts up again.
     */
    public toJSONString(): string {
        const data: SessionData = {
            stateMachineStack: this.stateMachineStack,
            attributes: this.attributes,
        };
        return JSON.stringify(data);
    }

    public pushState(position: StateMachinePositionState): void {
        this.stateMachineStack.push({type: "STATE", ...position});
    }

    public pushPosition(position: StateMachinePosition): void {
        this.stateMachineStack.push(position);
    }

    public popPosition(): StateMachinePosition | undefined {
        return this.stateMachineStack.pop();
    }

}
