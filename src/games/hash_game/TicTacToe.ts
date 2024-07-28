import { Namespace } from 'socket.io';
import HashGameLogic, { TicTacToeState } from './TicTacToeLogic';
import TicTacToeNetwork from './TicTacToeNetwork';
import GameRoom from '@/resources/room_managers/game/GameRoom';

class TicTacToe {
    private gameLogic: HashGameLogic;
    private gameNetwork: TicTacToeNetwork;
    private gameRoom: GameRoom;

    constructor(io: Namespace, room: GameRoom) {
        this.gameRoom = room;
        this.gameNetwork = new TicTacToeNetwork(io, room);

        let players = this.gameNetwork.createPlayersFromRoom(room);

        this.gameLogic = new HashGameLogic(players);

        this.gameLogic.addListener(this.onPlayerPlay.bind(this));
        this.gameNetwork.addListener(this.playReceived.bind(this));
        io.to(room.getName()).emit('send_game_state', this.getGameState());
    }

    public getRoomName() {
        return this.gameRoom.getName();
    }

    public onPlayerPlay(gameState: TicTacToeState) {
        this.gameNetwork.sendGameState(gameState);
    }

    public playReceived(userId: string, coordinate: [number, number]) {
        let actualPlayer = this.gameLogic
            .getPlayers()
            .find((player) => player.getId() === userId);

        if (!actualPlayer) return;

        if (this.gameLogic.isPlayerTurn(actualPlayer)) {
            this.gameLogic.play(coordinate);
        }
    }

    public getGameState(): TicTacToeState {
        return this.gameLogic.getGameState();
    }
}

export default TicTacToe;
