import * as Command from '../commands';
import {InitialState, LexBotResponseState, Machine, State} from "../decorators";
import {LexBot, LexBotResult, LexIntent, StateResponse, Voice} from "../types";
import {StateMachineSession} from "../session";
import {TicTacToeBoard, Tile} from "../tic-tac-toe/TicTacToeBoard";

@Machine
export class TicTacToeStateMachine {

    @InitialState
    static StartHandler(): StateResponse {
        return Command.SetVoice(Voice.MATTHEW).then(this.WelcomeMessage);
    }

    @State
    static WelcomeMessage(session: StateMachineSession): StateResponse {
        const gamesWon: number = session.attributes.ticTacToeGamesWon ||= 0;
        return Command.PlayPrompt(`<speak>Welcome to Tick Tack Toe. You have won ${gamesWon} game${gamesWon === 1 ? "" : "s"} so far.</speak>`)
            .then(this.WantToHearInstructions);
    }

    @State
    static WantToHearInstructions(): StateResponse {
        const message: string = "<speak>Would you like to hear the instructions?</speak>";
        return Command.InputFromLexBot(
            {
                lexBot: LexBot.YES_NO,
                ssml: message,
                attempts: 3,
                bargeIn: true
            },
            this.WantToHearInstructionsResponse,
            this.UnableToUnderstand
        )
    }


    @LexBotResponseState<LexBot.YES_NO>()
    static WantToHearInstructionsResponse(session: StateMachineSession, lexBotResult: LexBotResult<LexBot.YES_NO>): StateResponse {
        switch (lexBotResult.intent) {
            case LexIntent.YES:
                return Command.NextState(this.HearInstructions);
            case LexIntent.NO:
                return Command.NextState(this.NewGame);
            case LexIntent.FALLBACK:
                return Command.Retry;
        }
    }

    @State
    static HearInstructions(): StateResponse {
        const message: string = "<speak>" +
            " The game is standard Tick Tack Toe. You are exes, and I am ohs." +
            " The goal is to get three exes in a row before I can get three ohs in a row." +
            " The board is the numbers 1 through 9 on your key pad." +
            " When it is your turn, you can press any of the numbers 1 through 9 to place an ex on that spot." +
            " You can also say ,'board', to hear a read out of the current board. " +
            " </speak>";
        return Command.PlayPrompt(message).then(this.NewGame);
    }

    @State
    static NewGame(session: StateMachineSession): StateResponse {
        session.attributes.ticTacToeBoard = new TicTacToeBoard();
        session.attributes.ticTacToeTurn ||= Tile.X;
        return Command.NextState(this.NextTurn);
    }

    @State
    static NextTurn(session: StateMachineSession): StateResponse {
        const board: TicTacToeBoard = session.attributes.ticTacToeBoard!;
        if (board.isBoardFull()) {
            return Command.NextState(this.TieGame);
        }
        switch (session.attributes.ticTacToeTurn!) {
            case Tile.X:
                session.attributes.ticTacToeTurn = Tile.O;
                return Command.NextState(this.GameMenu);
            case Tile.O:
                session.attributes.ticTacToeTurn = Tile.X;
                return Command.NextState(this.ComputerTurn);
        }
    }

    @State
    static ComputerTurn(session: StateMachineSession): StateResponse {
        const board: TicTacToeBoard = session.attributes.ticTacToeBoard!;
        const chosenTileIndex: number = board.automaticMove(Tile.O);
        const message: string = `<speak>It's my turn, I put an 'o' on tile '${chosenTileIndex + 1}'.</speak>`;
        return Command.PlayPrompt(message).then(this.CheckForWin);
    }

    @State
    static GameMenu(): StateResponse {
        const message: string = "<speak>It's your move, what would you like to do? You can say ,'board', to hear the current state of the board, or press a number on your keypad to place an 'x' on that spot.</speak>";
        return Command.InputFromLexBot(
            {
                lexBot: LexBot.TIC_TAC_TOE,
                ssml: message,
                attempts: 3,
                bargeIn: true,
                dtmfTimeoutMs: 1
            },
            this.GameMenuResponse,
            this.UnableToUnderstand
        )
    }

    @LexBotResponseState<LexBot.TIC_TAC_TOE>()
    static GameMenuResponse(session: StateMachineSession, lexBotResult: LexBotResult<LexBot.TIC_TAC_TOE>): StateResponse {
        switch (lexBotResult.intent) {
            case LexIntent.BOARD:
                return Command.NextState(this.HearBoard);
            case LexIntent.SELECT_TILE:
                session.attributes.ticTacToeMoveSelection = parseInt(lexBotResult.getSlots<LexIntent.SELECT_TILE>().tile) // TODO Reevaluate how we get slots
                return Command.NextState(this.SelectTile);
            case LexIntent.FALLBACK:
                return Command.Retry;
        }
    }

    @State
    static HearBoard(session: StateMachineSession): StateResponse {
        const board: TicTacToeBoard = session.attributes.ticTacToeBoard!;
        const readout: string = board.getTiles().map(tile => `'${tile}'`).join(" <break time=\"0.25s\"/> ");
        const message: string = `<speak>I will list the tiles of the board from 1 to 9. ${readout}</speak>`;
        return Command.PlayPrompt(message).then(this.GameMenu);
    }

    @State
    static SelectTile(session: StateMachineSession): StateResponse {
        const board: TicTacToeBoard = session.attributes.ticTacToeBoard!;
        const selection: number = session.attributes.ticTacToeMoveSelection!;
        const tileIndex: number = selection - 1;
        delete session.attributes.ticTacToeMoveSelection;

        if (board.isBlankTile(tileIndex)) {
            board.setTile(tileIndex, Tile.X);
            const message: string = `<speak>You place an ex on tile '${selection}'.</speak>`;
            return Command.PlayPrompt(message).then(this.CheckForWin);
        } else {
            const message: string = "<speak>That tile has already been selected.</speak>";
            return Command.PlayPrompt(message).then(this.GameMenu);
        }
    }

    @State
    static CheckForWin(session: StateMachineSession): StateResponse {
        const board: TicTacToeBoard = session.attributes.ticTacToeBoard!;
        switch (board.winner) {
            case Tile.X:
                return Command.NextState(this.PlayerWin)
            case Tile.O:
                return Command.NextState(this.PlayerLose)
            case null:
                return Command.NextState(this.NextTurn)
        }
    }

    @State
    static PlayerWin(session: StateMachineSession): StateResponse {
        const message: string = "<speak>Congratulations! You have won.</speak>";
        session.attributes.ticTacToeGamesWon!++
        return Command.PlayPrompt(message).then(this.WantToPlayAgain);
    }

    @State
    static TieGame(): StateResponse {
        const message: string = "<speak>It's a draw, no spaces are left on the board.</speak>"
        return Command.PlayPrompt(message).then(this.WantToPlayAgain);
    }

    @State
    static PlayerLose(): StateResponse {
        const message: string = "<speak>I win! Better luck next time.</speak>"
        return Command.PlayPrompt(message).then(this.WantToPlayAgain);
    }

    @State
    static WantToPlayAgain(): StateResponse {
        const message: string = "<speak>Would you like to play again?</speak>"
        return Command.InputFromLexBot(
            {
                lexBot: LexBot.YES_NO,
                ssml: message,
                attempts: 3,
                bargeIn: true
            },
            this.WantToPlayAgainResponse,
            this.UnableToUnderstand
        )
    }

    @LexBotResponseState<LexBot.YES_NO>()
    static WantToPlayAgainResponse(session: StateMachineSession, lexBotResult: LexBotResult<LexBot.YES_NO>): StateResponse {
        switch (lexBotResult.intent) {
            case LexIntent.YES:
                return Command.NextState(this.NewGame);
            case LexIntent.NO:
                return Command.NextState(this.ThanksForPlaying);
            case LexIntent.FALLBACK:
                return Command.Retry;
        }
    }

    @State
    static UnableToUnderstand(): StateResponse {
        const message: string = "<speak>Sorry, but I haven't been able to understand you. You will now be taken back to the main menu.</speak>"
        return Command.PlayPrompt(message).then(this.ThanksForPlaying);
    }

    @State
    static ThanksForPlaying(): StateResponse {
        const message: string = "<speak>Thanks for playing Tick Tack Toe!</speak>"
        return Command.PlayPrompt(message).then(this.Finish);
    }

    @State
    static async Finish(session: StateMachineSession): Promise<StateResponse> {
        delete session.attributes.ticTacToeBoard;
        return Command.PopStateMachine;
    }

}