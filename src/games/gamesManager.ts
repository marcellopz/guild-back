import HashGame from "./hash_game/hashGame";
import Player from "./player";

class GamesManager{
    private _players : Array<Player> = new Array<Player>(new Player("P1"), new Player("P2"))
    private _hash_game : HashGame

    constructor(){
        this._hash_game = new HashGame(this._players)
    }
}

export default GamesManager