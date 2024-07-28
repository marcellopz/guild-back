import { Namespace } from 'socket.io';
import GameRoom from '@/resources/room_managers/game/GameRoom';
import Player from '../player';
import Hash from './hash';

class TicTacToeNetwork {
    private io: Namespace;
    private room: GameRoom;

    private _receivedPlayerPlay: ((userId:string, coordinate:[number, number]) => void)[] = [];

    public constructor(io: Namespace, room: GameRoom) {
        this.room = room;
        this.io = io;

        this.io.on("front_player_play", this.receivePlayerPlay);
    }

    public createPlayersFromRoom(room: GameRoom): Player[] {
        let players: Player[] = [];
        room.getPlayers().map((user) => {
            let player: Player = new Player(user.username, user.id);
            players.push(player);
        });
        return players;
    }

    public sendPlayerPlay(hash:Hash, player:Player){
        this.io.to(this.room.getName()).emit("back_player_play", hash, player);
    }

    public sendPlayerWin(player: Player){
        this.io.to(this.room.getName()).emit("back_player_win", player);
    }

    public receivePlayerPlay(userId:string, coordinate:[number, number]){
        this.callEvent(userId, coordinate);
    }

    public addListener(callback: (userId:string, coordinate:[number, number]) => void) {
        this._receivedPlayerPlay.push(callback);
    }

    public callEvent(userId:string, coordinate:[number, number]){
        this._receivedPlayerPlay.forEach(callback => callback(userId, coordinate));
    }
}

export default TicTacToeNetwork;
