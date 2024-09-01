import Player from 'games/player';
import Hash from './hash';
import TurnManager from './turnManager';
import TicTacToeRule from './TicTacToeRule';
import HashTile from './hashTile';

function isTie(grid: HashTile[][], winner: Player | null): boolean {
    return (
        !winner &&
        grid.every((row) => row.every((tile) => tile.getSymbol() !== ''))
    );
}

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
        this._rule.addConditionMetListener(this.onPlayerWin.bind(this));
    }

    public play(coordinates: [number, number]) {
        let playerSymbol = this._turn_manager.getActualPlayer()?.get_symbol();
        if (!playerSymbol) return;
        let playTile = this._hash.getTile(coordinates);

        if (playTile.getSymbol() == '') {
            playTile.setSymbol(playerSymbol);
        }

        let player = this._turn_manager.getActualPlayer();

        player
            ? this._rule.checkWinner(player, coordinates)
            : console.error('Player is null or undefined.');

        this._turn_manager.changeTurn();

        this.callEvent(this.getGameState());
    }

    public getHash(): Hash {
        return this._hash;
    }

    public onPlayerWin(player: Player) {
        this._winner = player;
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
            draw: isTie(this._hash.getGrid(), this._winner),
            players: this._players,
        };
    }

    public hasEnded(): boolean {
        return this._rule.Ended;
    }
}

export default HashGameLogic;
