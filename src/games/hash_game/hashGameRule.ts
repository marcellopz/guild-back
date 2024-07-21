import GameRule from "../gameRule";
import HashGame from "./hashGame";
import Player from "games/player";
import HashTile from "./hashTile";
import Hash from "./hash";
import { Socket } from "socket.io";

class HashGameRule extends GameRule<HashGame>{
    private _hash_game: HashGame;
    constructor(hash_game:HashGame){
        super(hash_game);
        this._hash_game = hash_game
    }

    public onPlayerPlay(player:Player, hash_tile:HashTile){
        var hash : Hash = this._hash_game.getHash()
        var game_win : boolean = hash.checkCoordinate(hash_tile.getCoordinates(), player.get_symbol())
        if (game_win)
        {
            this.win()
        }
    }
}

export default HashGameRule;