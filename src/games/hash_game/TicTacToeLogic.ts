import Player from 'games/player';
import Hash from './hash';
import TurnManager from './turnManager';
import TicTacToeRule from './TicTacToeRule';
import HashTile from './hashTile';

export type TicTacToeState = {
    playerTurn?: string;
    grid: HashTile[][];
    playerWin: Player | null;
    draw: boolean;
    players: Player[];
};

class HashGameLogic {
    private _hash: Hash = new Hash();
    private _turn_manager: TurnManager;
    private _players: Player[];
    private _rule: TicTacToeRule;

    private _playerPlay: ((gameState: TicTacToeState) => void)[] = [];

    private _winner: Player | null = null;

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

        this.callEvent(this.getGameState());
    }

    public getHash(): Hash {
        return this._hash;
    }

    public onPlayerWin(player: Player) {
        this._winner = player;
        // the actual player wins
    }

    public addListener(callback: (gameState: TicTacToeState) => void) {
        this._playerPlay.push(callback);
    }

    public callEvent(gameState: TicTacToeState) {
        this._playerPlay.forEach((callback) => callback(gameState));
    }

    public getRule(): TicTacToeRule {
        return this._rule;
    }

    public isPlayerTurn(player: Player): boolean {
        return player === this._turn_manager.getActualPlayer();
    }

    public getPlayers(): Player[] {
        return this._players;
    }

    public getGameState(): TicTacToeState {
        return {
            playerTurn: this._turn_manager.getActualPlayer()?.getId(),
            grid: this._hash.getGrid(),
            playerWin: this._winner,
            draw: false,
            players: this._players,
        };
    }
}

export default HashGameLogic;
