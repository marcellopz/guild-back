import OxGameCard from "./oxGameCard";

class OxGameTableTile{
    private _index:number;
    private _card: OxGameCard | null = null;

    constructor(index:number){
        this._index = index;
    }

    public getCard():OxGameCard | null{
        return this._card;
    }

    public getIndex():number{
        return this._index;
    }

    public putCard(card: OxGameCard){
        this._card = card;
    }

    public removeCard(card: OxGameCard){
        this._card = null;
    }
}

export default OxGameTableTile;