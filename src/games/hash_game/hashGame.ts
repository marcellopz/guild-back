import Player from "games/player";
import Hash from "./hash";
import TurnManager from "./turnManager";
import HashGameRule from "./hashGameRule";

class HashGame{
    private _hash : Hash = new Hash();
    private _turn_manager : TurnManager;
    private _players : Array<Player>;
    private _rule : HashGameRule;
    // game_rules

    constructor(players:Array<Player>){
        this._turn_manager = new TurnManager(players)
        this._rule = new HashGameRule(this);
        this._players = players;
        this._rule.addConditionMetListener(this.onPlayerWin)
    }

    public play(coordinates:number[]){
        let playerSymbol = this._turn_manager.getActualPlayer()?.get_symbol();
        if (!playerSymbol) return;
        let playTile = this._hash.getTile(coordinates)
        
        if (playTile.getSymbol() == ""){
            playTile.setSymbol(playerSymbol)
        }
        
        this._turn_manager.changeTurn();
    }

    public getHash(): Hash{
        return this._hash;
    }

    public onPlayerWin(){
        // the actual player wins
    }
}

export default HashGame;