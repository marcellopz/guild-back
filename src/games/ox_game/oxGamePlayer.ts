import OxGameCard from "./oxGameCard";

export class OxGamePlayer {
    private _points: number;
    private _cards: Array<OxGameCard>;

    constructor() {
        this._points = 66;
        this._cards = new Array<OxGameCard>();
    }

    public getPoints(): number {
        return this._points;
    }

    public getCards(): Array<OxGameCard> {
        return this._cards;
    }

    public addCard(card: OxGameCard) {
        this._cards.push(card);
    }

    public removeCard(card: OxGameCard) {
        this._cards.filter((actualCard) => {
            return actualCard.getValue() !== card.getValue()
        });
    }

    public removeCardAtIndex(index: number) {
        if (index !== -1) {
            this._cards.splice(index, 1);
        }
    }

    public modifyPoints(value:number){
        this._points += value;
    }
}