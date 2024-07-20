import HashGame from "./hash_game/hash_game";
import Player from "./player";

class GamesManager{
    public players : Array<Player> = new Array<Player>(new Player("P1"), new Player("P2"))
    public hash_game : HashGame

    constructor(){
        this.hash_game = new HashGame(this.players)
    }
}

export default GamesManager