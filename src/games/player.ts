class Player{
    private _name : string;
    private _symbol : string;

    constructor(name:string){
        this._name = name;
        this._symbol = "";
    }

    public set_name(name:string){
        this._name = name;
    }

    public get_name() : string{
        return this._name;
    }

    public set_symbol(symbol:string){
        this._symbol = symbol;
    }

    public get_symbol():string{
        return this._symbol;
    }
}

export default Player