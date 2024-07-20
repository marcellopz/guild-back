class Player{
    private name : string;
    private symbol : string;

    constructor(name:string){
        this.name = name;
        this.symbol = "";
    }

    public set_name(name:string){
        this.name = name;
    }

    public get_name() : string{
        return this.name;
    }

    public set_symbol(symbol:string){
        this.symbol = symbol;
    }

    public get_symbol():string{
        return this.symbol;
    }
}

export default Player