import * as _ from 'lodash';

type Tuple<T, N extends number, R extends T[] = []> =
    R["length"] extends N
    ? R
    : Tuple<T, N, [T, ...R]>;

type TicTacToeIndex = Partial<Tuple<never, 8>>["length"];

type Board = Record<TicTacToeIndex, Tile> & Pick<Array<Tile>,'forEach' | 'map' | 'filter'>;
export type PlayerTile = Tile.O | Tile.X;

export enum Tile {
    BLANK = "BLANK",
    O = "O",
    X = "X",
}

export class TicTacToeBoard {

    static isValidIndex(index: number): index is TicTacToeIndex {
        return (index >= 0 || index <= 8) && Math.round(index) === index;
    }

    private tiles: Board = [
        Tile.BLANK, Tile.BLANK, Tile.BLANK,
        Tile.BLANK, Tile.BLANK, Tile.BLANK,
        Tile.BLANK, Tile.BLANK, Tile.BLANK,
    ]

    private static winningPatterns: readonly Tuple<TicTacToeIndex, 3>[] = [
        // Rows
        [0,1,2],
        [3,4,5],
        [6,7,8],

        // Columns
        [0,3,6],
        [1,4,7],
        [2,5,8],

        // Diagonals
        [0,4,8],
        [2,4,6],
    ];

    private get rowsColumnsAndDiagonals(): Tuple<{index: TicTacToeIndex, tile: Tile}, 3>[] {
        return TicTacToeBoard.winningPatterns.map(pattern => pattern.map(index => {
            return {index, tile: this.tiles[index]}
        })) as Tuple<{index: TicTacToeIndex, tile: Tile}, 3>[];
    }

    getTiles(): Board {
        return this.tiles;
    }

    getTile(index: number): Tile {
        if (!TicTacToeBoard.isValidIndex(index)) {
            throw Error(`Invalid index '${index}', valid indices are from 0 to 8 inclusive`)
        }
        return this.tiles[index];
    }

    isBlankTile(index: number): boolean {
        const tile = this.getTile(index);
        return tile === Tile.BLANK;
    }

    isBoardFull(): boolean {
        return this.tiles.filter(tile => tile === Tile.BLANK).length === 0;
    }

    setTile(index: number, tile: PlayerTile): void {
        if (!TicTacToeBoard.isValidIndex(index)) {
            throw Error(`Invalid index '${index}', valid indices are from 0 to 8 inclusive`)
        }
        if (!this.isBlankTile(index)) {
            throw Error(`Tried to set a non-blank tile at index '${index}'`);
        }
        this.tiles[index] = tile;
    }

    automaticMove(tile: PlayerTile): TicTacToeIndex {
        if (this.isBoardFull()) {
            throw Error('Board is full, automatic move is impossible.');
        }

        const otherPlayer: PlayerTile = tile === Tile.X ? Tile.O : Tile.X;
        const tileTrios = this.rowsColumnsAndDiagonals;
        const chosenIndex: TicTacToeIndex = (() => {
            // Always pick center tile if available
            if (this.isBlankTile(4)) {
                return 4;
            }
            // Win if you can
            for (const trio of tileTrios) {
                const tileTrio = trio.map(e => e.tile) as Tuple<Tile, 3>;
                if (_.isEqual(tileTrio.sort(), [tile, tile, Tile.BLANK].sort())) {
                    return trio.find(indexedTile => indexedTile.tile === Tile.BLANK)!.index;
                }
            }
            // Prevent any losses on the next turn
            for (const trio of tileTrios) {
                const tileTrio = trio.map(e => e.tile) as Tuple<Tile, 3>;
                if (_.isEqual(tileTrio.sort(), [otherPlayer, otherPlayer, Tile.BLANK].sort())) {
                    return trio.find(indexedTile => indexedTile.tile === Tile.BLANK)!.index;
                }
            }
            // Otherwise, chose a random blank tile
            const blankTileIndices: TicTacToeIndex[] = this.tiles
                .map((tile, index) => {return {tile, index}})
                .filter(indexedTile => indexedTile.tile === Tile.BLANK)
                .map(indexedTile => indexedTile.index as TicTacToeIndex);
            return _.sample(blankTileIndices)!; // Not null b/c already checked for full board

        })()
        this.setTile(chosenIndex, tile);
        return chosenIndex;
    }

    get winner(): PlayerTile | null {
        for (const trio of this.rowsColumnsAndDiagonals) {
            if (_.uniq(trio.map(e => e.tile)).length === 1 && trio[0].tile !== Tile.BLANK) {
                return trio[0].tile;
            }
        }
        return null;
    }

}