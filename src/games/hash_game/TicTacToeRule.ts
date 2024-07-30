import HashGameLogic from './TicTacToeLogic';
import Player from 'games/player';
import HashTile from './hashTile';
import Hash from './hash';
import { GameRule } from '../gameRule';

class TicTacToeRule extends GameRule<HashGameLogic> {
    private _hash_game: HashGameLogic;
    constructor(hash_game: HashGameLogic) {
        super(hash_game);
        this._hash_game = hash_game;
    }

    public checkWinner(player: Player, coordinates:[number, number]) {
        var hash: Hash = this._hash_game.getHash();
        var game_win: boolean = hash.checkCoordinate(
            coordinates,
            player.get_symbol(),
        );
        if (game_win) {
            this.win(player);
        }
    }
}

export default TicTacToeRule;
