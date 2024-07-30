import OxGameCard from "./oxGameCard";
import OxGameCardsManager from "./oxGameCardsManager";
import { OxGamePlayer } from "./oxGamePlayer";
import OxGameRule from "./oxGameRule";
import OxGameTable from "./oxGameTable";
import OxGameTableLine from "./oxGameTableLine";

export class OxGame {
    private _oxRule: OxGameRule;
    private _table: OxGameTable;
    private _cardsManager: OxGameCardsManager;
    
    private _players: OxGamePlayer[] = [];
    private _playPile: OxGameCard[] = [];

    constructor(players: OxGamePlayer[]){
        this._oxRule = new OxGameRule(this);
        this._table = new OxGameTable();
        this._cardsManager = new OxGameCardsManager();
        this._players = players;
    }

    public startGame(){
        this._cardsManager.initialize(this._players);
        this._playPile = [];
    }

    public sortPlayPile(): OxGameCard[] {
        return this._playPile.sort((a, b) => a.getValue() - b.getValue());
    }

    public addCardToPlayPile(card: OxGameCard){
        this._playPile.push(card)
    }

    public playCards(){
        this.sortPlayPile();
        this._playPile.forEach(card => {
            this.playCard(card);
        });
    }

    public playCard(card: OxGameCard){
        let possibleLines: OxGameTableLine[] = this._table.getPossibleLines(card)

        if (possibleLines.length > 0){
            let higherValuePossibleLine = this._table.getHigherValueLine(possibleLines);
            higherValuePossibleLine.addCard(card);
        }
        else{
            // player select line
        }
    }

    public playerTakesLine(player:OxGamePlayer, index:number){
        let selectedLine:OxGameTableLine = this._table.getLines()[index];
        player.modifyPoints(-selectedLine.getPoints())
        selectedLine.clear();
    }
}
