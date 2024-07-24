import Player from "./player";

export class GameRule<T>{
    private _game: T;
    private _ended: boolean = false;
    private _conditionMet: ((value: boolean) => void)[] = [];

    constructor(game:T){
        this._game = game;
    }

    get Ended():boolean{
        return this._ended;
    }

    public win(){
        if (!this._ended){
            this._conditionMet.forEach(callback => callback(true));
            this._ended = true;
        }
    }

    public lose(){
        if (!this._ended){
            this._conditionMet.forEach(callback => callback(false));
            this._ended = true;
        }
    }

    public addConditionMetListener(callback: (value: boolean) => void) {
        this._conditionMet.push(callback);
    }
}