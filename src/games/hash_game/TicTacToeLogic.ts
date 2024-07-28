import Player from 'games/player';
import Hash from './hash';
import TurnManager from './turnManager';
import TicTacToeRule from './TicTacToeRule';
import { GameRule } from '../gameRule';

class HashGameLogic {
    private _hash: Hash = new Hash();
    private _turn_manager: TurnManager;
    private _players: Player[];
    private _rule: TicTacToeRule;

    private _playerPlay: ((hash:Hash, player:Player) => void)[] = [];


    // game_rules

    constructor(players: Player[]) {
        this._players = players;
        this._turn_manager = new TurnManager(this._players);
        this._rule = new TicTacToeRule(this);
        this._rule.addConditionMetListener(this.onPlayerWin);
    }

    public play(coordinates: number[]) {
        let playerSymbol = this._turn_manager.getActualPlayer()?.get_symbol();
        if (!playerSymbol) return;
        let playTile = this._hash.getTile(coordinates);

        if (playTile.getSymbol() == '') {
            playTile.setSymbol(playerSymbol);
        }

        this._turn_manager.changeTurn();

        this.callEvent();
    }

    public getHash(): Hash {
        return this._hash;
    }

    public onPlayerWin(player:Player) {
        // the actual player wins
    }

    public addListener(callback: (hash:Hash, player:Player) => void) {
        this._playerPlay.push(callback);
    }

    public callEvent(){
        let player = this._turn_manager.getActualPlayer();
        if (!player) return;
        this._playerPlay.forEach(callback => callback(this._hash, player));
    }

    public getRule(): TicTacToeRule{
        return this._rule;
    }

    public isPlayerTurn(player:Player):boolean{
        return player === this._turn_manager.getActualPlayer();
    }

    public getPlayers():Player[]{
        return this._players;
    }
}

export default HashGameLogic;
