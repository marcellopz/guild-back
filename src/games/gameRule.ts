import Player from "./player";

export class GameRule<T>{
    private _game: T;
    private _ended: boolean = false;
    private _conditionMet: ((player: Player) => void)[] = [];

    constructor(game:T){
        this._game = game;
    }

    get Ended():boolean{
        return this._ended;
    }

    public win(player:Player){
        if (!this._ended){
            this._conditionMet.forEach(callback => callback(player));
            this._ended = true;
        }
    }

    public addConditionMetListener(callback: (player: Player) => void) {
        this._conditionMet.push(callback);
    }

    public callEvent(player:Player){
        this._conditionMet.forEach(callback => callback(player));
    }
}