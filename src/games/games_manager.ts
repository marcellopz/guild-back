import HashGame from "./hash_game/hash_game";

class GamesManager{
    public hash_game : HashGame

    constructor(){
        this.hash_game = new HashGame()
    }
}