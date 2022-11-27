import {InitialState, LexBotResponseState, Machine, State} from "../decorators";
import * as Commands from '../commands'
import {StateMachineSession} from "../session";
import {LexBot, LexBotResult, LexIntent, StateResponse, Voice} from "../types";
import {TicTacToeStateMachine} from "./TicTacToeStateMachine";

@Machine
export class MainMenuStateMachine {

    @InitialState
    static StartHandler(): StateResponse {
        return Commands.SetVoice(Voice.JOANNA).then(this.MainMenu)
    }

    @State
    static MainMenu(): StateResponse {
        const message = "<speak>What would you like to do? You can say things like 'Play Tick Tack Toe', or 'Transfer to Joey'.</speak>";
        return Commands.InputFromLexBot(
            {
                lexBot: LexBot.MAIN_MENU,
                ssml: message,
                attempts: 3,
                bargeIn: true,
            },
            this.MainMenuBotResponse,
            this.MainMenuBotOutOfAttempts
        );
    }

    @LexBotResponseState<LexBot.MAIN_MENU>()
    static MainMenuBotResponse(session: StateMachineSession, lexBotResult: LexBotResult<LexBot.MAIN_MENU>): StateResponse {
        switch (lexBotResult.intent) {
            case LexIntent.PLAY_TIC_TAC_TOE:
                return Commands.PushStateMachine(TicTacToeStateMachine.StartHandler).followedBy(this.StartHandler);
            case LexIntent.TRANSFER_TO_JOEY:
                return Commands.NextState(this.ForwardToJoeyMessage);
            case LexIntent.FALLBACK:
                return Commands.Retry;
        }
    }

    @State
    static MainMenuBotOutOfAttempts(): StateResponse {
        const message = "<speak>Sorry, but I haven't been able to understand you. You will now be disconnected.</speak>";
        return Commands.PlayPrompt(message).then(this.HangUp);
    }

    @State
    static ForwardToJoeyMessage(): StateResponse {
        const message = "<speak>Transferring you to Joey.</speak>";
        return Commands.PlayPrompt(message).then(this.ForwardToJoey);
    }

    @State
    static ForwardToJoey(): StateResponse {
        return Commands.TransferToPhone('+14045762246');
    }

    @State
    static HangUp(): StateResponse {
        return Commands.HangUp;
    }

}
