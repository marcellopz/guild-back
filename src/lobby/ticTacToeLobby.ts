import TicTacToe from '@/games/hash_game/TicTacToe';
import GameRoom from '@/resources/room_managers/game/GameRoom';
import GameRoomManager from '@/resources/room_managers/game/GameRoomManager';
import { Socket } from 'socket.io';

class TicTacToeLobby {
    private gameRoomManager: GameRoomManager;
    private activeGames: TicTacToe[];
    private maxPlayers: number = 2;

    constructor() {
        this.gameRoomManager = new GameRoomManager('tic-tac-toe', this);
        this.activeGames = [];
    }

    public startNewGame(room: GameRoom, socket: Socket) {
        if (
            this.activeGames.find(
                (game) => game.getRoomName() === room.getName(),
            )
        ) {
            socket.emit('game_already_started', room.getName());
            return;
        }
        if (room.getPlayers().length !== 2) {
            socket.emit('not_enough_players', room.getName());
            return;
        }
        let game: TicTacToe = new TicTacToe(this.gameRoomManager.getIo(), room);
        this.activeGames.push(game);
    }

    public deleteGame(room: GameRoom) {
        this.activeGames = this.activeGames.filter(
            (game) => game.getRoomName() !== room.getName(),
        );
    }

    public getActiveGames() {
        return this.activeGames;
    }

    public getMaxPlayers() {
        return this.maxPlayers;
    }
}

export default TicTacToeLobby;
