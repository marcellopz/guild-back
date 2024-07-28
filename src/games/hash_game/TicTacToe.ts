import { Namespace } from 'socket.io';
import HashGameLogic from './TicTacToeLogic';
import TicTacToeNetwork from './TicTacToeNetwork';
import GameRoom from '@/resources/room_managers/game/GameRoom';
import Player from '../player';
import Hash from './hash';

class TicTacToe {
    private gameLogic: HashGameLogic;
    private gameNetwork: TicTacToeNetwork;
    private gameRoom: GameRoom;

    constructor(io: Namespace, room: GameRoom) {
        this.gameRoom = room;
        this.gameNetwork = new TicTacToeNetwork(io, room);

        let players = this.gameNetwork.createPlayersFromRoom(room);

        this.gameLogic = new HashGameLogic(players);

        this.gameLogic.addListener(this.onPlayerPlay);
        this.gameNetwork.addListener(this.playReceived)
    }

    public getRoomName() {
        return this.gameRoom.getName();
    }

    public onPlayerPlay(hash: Hash, player:Player){
        this.gameNetwork.sendPlayerPlay(hash, player);
    }

    public onPlayerWin(player:Player) {
        this.gameNetwork.sendPlayerWin(player);
    }

    public playReceived(userId:string, coordinate:[number, number]){
        
        let actualPlayer = this.gameLogic.getPlayers().find( (player) => player.getId() === userId);

        if (!actualPlayer) return;
        
        if (this.gameLogic.isPlayerTurn(actualPlayer)){
            this.gameLogic.play(coordinate);
        }
    }
}

export default TicTacToe;
