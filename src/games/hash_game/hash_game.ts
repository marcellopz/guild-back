import Player from "games/player";
import Hash from "./hash";
import TurnManager from "./turn_manager";
import HashGameRule from "./hash_game_rule";

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
        this._rule.addConditionMetListener(this.on_player_win)

    }

    public get_hash(): Hash{
        return this._hash;
    }

    public on_player_win(){
        // the actual player wins
    }
}

export default HashGame;