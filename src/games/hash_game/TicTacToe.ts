import { Namespace } from 'socket.io';
import HashGameLogic from './TicTacToeLogic';
import HashGameNetwork from './TicTacToeNetwork';
import GameRoom from '@/resources/room_managers/game/GameRoom';

class TicTacToe {
    private gameLogic: HashGameLogic;
    private gameNetwork: HashGameNetwork;
    private gameRoom: GameRoom;

    constructor(io: Namespace, room: GameRoom) {
        this.gameRoom = room;
        this.gameNetwork = new HashGameNetwork(io, room);

        let players = this.gameNetwork.createPlayersFromRoom(room);

        this.gameLogic = new HashGameLogic(players);
    }

    public getRoomName() {
        return this.gameRoom.getName();
    }
}

export default TicTacToe;
