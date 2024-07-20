import GameRule from '../game_rule';
import HashGame from './hash_game';
import Player from 'games/player';
import HashTile from './hash_tile';
import Hash from './hash';

class HashGameRule extends GameRule<HashGame> {
    private _hash_game: HashGame;
    constructor(hash_game: HashGame) {
        super(hash_game);
        this._hash_game = hash_game;
    }

    public on_player_play(player: Player, hash_tile: HashTile) {
        var hash: Hash = this._hash_game.get_hash();
        var game_win: boolean = hash.check_coordinate(
            hash_tile.get_coordinates(),
            player.get_symbol(),
        );
        if (game_win) {
            this.win();
        }
    }
}

export default HashGameRule;
