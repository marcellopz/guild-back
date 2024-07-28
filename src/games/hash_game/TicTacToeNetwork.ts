import { Namespace } from 'socket.io';
import GameRoom from '@/resources/room_managers/game/GameRoom';
import Player from '../player';

class HashGameNetwork {
    private io: Namespace;
    private room: GameRoom;

    public constructor(io: Namespace, room: GameRoom) {
        this.room = room;
        this.io = io;
    }

    public createPlayersFromRoom(room: GameRoom): Player[] {
        let players: Player[] = [];
        room.getPlayers().map((user) => {
            let player: Player = new Player(user.username, user.id);
            players.push(player);
        });
        return players;
    }
}

export default HashGameNetwork;
