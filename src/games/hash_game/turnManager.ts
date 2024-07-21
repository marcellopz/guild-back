import Random from "@/utils/random/random";
import Player from "games/player";

class TurnManager{
    private _players : Array<Player>;
    private _actual_player : Player | null = null;
    private _actual_index : number;

    constructor(players:Array<Player>){
        this._players = players;
        this._actual_index = this.randomizeTurn();
        this._actual_player = players[this._actual_index];
    }

    public randomizeTurn() : number{
        var randNum = Random.getRandomIntInclusive(0, 1);
        return randNum;
    }

    public changeTurn(){
        if (this._actual_index == 0){
            this._actual_index = 1;
        }
        else{
            this._actual_index = 0;
        }
        this._actual_player = this._players[this._actual_index]
    }

    public getActualPlayer() : Player | null {
        return this._actual_player;
    }
}

export default TurnManager