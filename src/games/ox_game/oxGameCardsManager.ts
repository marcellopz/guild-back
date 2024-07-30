import Random from "@/utils/random/random";
import OxGameCard from "./oxGameCard";
import { OxGamePlayer } from "./oxGamePlayer";

class OxGameCardsManager{
    private _cards: OxGameCard[] = [];
    private _shuffledCards: OxGameCard[] = [];

    constructor(){
        this.createCards();
    }

    public createCards(){
        for(var i = 1; i < 105; i ++){
            this.createCard(i);
        }
    }

    public createCard(value:number) : OxGameCard{
        let card = new OxGameCard(value)
        return card;
    }

    public shuffleCards(){
        this._shuffledCards = Random.shuffle(this._cards)
    }

    public distributeCards(players: Array<OxGamePlayer>){
        players.forEach(player => {
            for (var i = 0; i < 10; i++){
                let card = this._shuffledCards.pop()
                if (!card) return
                player.addCard(card)
                card.setOwner(player)
            }
        });
    }

    public initialize(players : Array<OxGamePlayer>){
        this.shuffleCards()
        this.distributeCards(players)
    }
}

export default OxGameCardsManager;