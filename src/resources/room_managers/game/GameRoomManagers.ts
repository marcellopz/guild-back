import GameRoomManager from './GameRoomManager';

class GameRoomManagers {
    private _managers: GameRoomManager[];

    public constructor() {
        this._managers = [new GameRoomManager('tic-tac-toe')];
    }

    public getTicTacToeRoomManager() {
        return this._managers[0];
    }
}

export default GameRoomManagers;
