import { Namespace } from 'socket.io';
import GameRoom from '@/resources/room_managers/game/GameRoom';
import Player from '../player';
import Hash from './hash';
import { TicTacToeState } from './TicTacToeLogic';

// const gameState = {
//     playerTurn: 'playerId',
//     board: [
//         ['', '', ''],
//         ['', '', ''],
//         ['', '', ''],
//     ],
//     playerWin: null, // 'ou o id'
//     draw: false,
//     playerSymbols: {
//         playerId1: 'X',
//         playerId2: 'O',
//     },
// };

class TicTacToeNetwork {
    private io: Namespace;
    private room: GameRoom;

    private _receivedPlayerPlay: ((
        userId: string,
        coordinate: [number, number],
    ) => void)[] = [];

    public constructor(io: Namespace, room: GameRoom) {
        this.room = room;
        this.io = io;

        this.room.getPlayers().forEach((player) => {
            player.socket.on(
                'front_player_play',
                this.receivePlayerPlay.bind(this),
            );
        });
    }

    public sendGameState(gameState: TicTacToeState) {
        this.io.to(this.room.getName()).emit('send_game_state', gameState);
    }

    public receivePlayerPlay(userId: string, coordinate: [number, number]) {
        this.callEvent(userId, coordinate);
    }

    public addListener(
        callback: (userId: string, coordinate: [number, number]) => void,
    ) {
        this._receivedPlayerPlay.push(callback);
    }

    public callEvent(userId: string, coordinate: [number, number]) {
        console.log('received play', userId, coordinate);
        this._receivedPlayerPlay.forEach((callback) =>
            callback(userId, coordinate),
        );
    }
}

export default TicTacToeNetwork;
