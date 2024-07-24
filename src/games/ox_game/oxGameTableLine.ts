import OxGameCard from "./oxGameCard";
import OxGameTableTile from "./oxGameTableTile";

class OxGameTableLine{
    private _tiles: Array<OxGameTableTile> = []
    private _lastCardIndex: number = -1;

    constructor(){
        this.createLine()
    }

    private createLine(){
        for(var i = 0; i < 6; i++){
            this._tiles.push(new OxGameTableTile(i))
        }
    }

    public getLastCard():OxGameCard | null | undefined{
        this._tiles.forEach(tile => {
            let card = tile.getCard()
            if (!card) return;
        });
        return this._tiles.at(-1)?.getCard()
    }

    public getLastCardValue():number | undefined{
        return this.getLastCard()?.getValue();
    }

    public getCards(): Array<OxGameCard>{
        return this._tiles
            .map(tile => tile.getCard())
            .filter(card => card != null) as Array<OxGameCard>;
    }

    public addCard(card: OxGameCard){
        this._tiles[this._lastCardIndex+1].putCard(card);
        this._lastCardIndex++;
    }

    public isCompleted(): boolean{
        if (this._lastCardIndex == 5){
            return true;
        }
        else
        {
            return false;
        }
    }

    public clear(){
        let lastCard = this._tiles.at(-1);
        if (!lastCard) return;
        this._tiles = new Array<OxGameTableTile>();
        this._tiles.push(lastCard);
        this._lastCardIndex = -1;
    }

    public getPoints(): number {
        return this._tiles
            .map(tile => tile.getCard()?.getValue())
            .filter(value => value != null)
            .slice(0, -1)
            .reduce((total, value) => total + value, 0);
    }
}

export default OxGameTableLine;