import {Type} from 'class-transformer';

import {PlayerTile, TicTacToeBoard} from "./tic-tac-toe/TicTacToeBoard";

export class AttributeHolder {

    @Type(() => TicTacToeBoard)
    ticTacToeBoard?: TicTacToeBoard;
    ticTacToeGamesWon?: number;
    ticTacToeMoveSelection?: number;
    ticTacToeTurn?: PlayerTile;

}
