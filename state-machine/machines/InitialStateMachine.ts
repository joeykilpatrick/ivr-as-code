import {InitialMachine, InitialState, State} from "../decorators";
import * as Commands from '../commands'
import {StateResponse, Voice} from "../types";
import {MainMenuStateMachine} from "./MainMenuStateMachine";


@InitialMachine
export class InitialStateMachine {

    @InitialState
    static StartHandler(): StateResponse {
        return Commands.SetVoice(Voice.JOANNA).then(this.WelcomeMessage);
   }

    @State
    static WelcomeMessage(): StateResponse {
        const welcomeMessage = "<speak>Welcome to the demo for the IVR as code system.</speak>";
        return Commands.PlayPrompt(welcomeMessage).then(MainMenuStateMachine.StartHandler);
    }

}
