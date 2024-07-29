import { Namespace } from 'socket.io';
import HashGameLogic, { TicTacToeState } from './TicTacToeLogic';
import TicTacToeNetwork from './TicTacToeNetwork';
import GameRoom from '@/resources/room_managers/game/GameRoom';
import Player from '../player';

class TicTacToe {
    private _gameLogic: HashGameLogic;
    private _gameNetwork: TicTacToeNetwork;
    private _gameRoom: GameRoom;

    constructor(io: Namespace, room: GameRoom) {
        this._gameRoom = room;
        this._gameNetwork = new TicTacToeNetwork(io, room);

        let players = this.createPlayersFromRoom(room);

        this._gameLogic = new HashGameLogic(players);

        this._gameLogic.addListener(this.onPlayerPlay.bind(this));
        this._gameNetwork.addListener(this.playReceived.bind(this));
        io.to(room.getName()).emit('send_game_state', this.getGameState());
    }

    public getRoomName() {
        return this._gameRoom.getName();
    }

    public createPlayersFromRoom(room: GameRoom): Player[] {
        let players: Player[] = [];
        room.getPlayers().map((user) => {
            let player: Player = new Player(user.username, user.id);
            players.push(player);
        });
        return players;
    }

    public onPlayerPlay(gameState: TicTacToeState) {
        this._gameNetwork.sendGameState(gameState);
    }

    public playReceived(userId: string, coordinate: [number, number]) {
        let actualPlayer = this._gameLogic
            .getPlayers()
            .find((player) => player.getId() === userId);

        if (!actualPlayer) return;

        if (this._gameLogic.isPlayerTurn(actualPlayer) && !this._gameLogic.hasEnded()) {
            this._gameLogic.play(coordinate);
        }
    }

    public getGameState(): TicTacToeState {
        return this._gameLogic.getGameState();
    }
}

export default TicTacToe;
