import TicTacToe from "@/games/hash_game/TicTacToe";
import GameRoom from "@/resources/room_managers/game/GameRoom";
import GameRoomManager from "@/resources/room_managers/game/GameRoomManager";
import SocketAdapter from "@/resources/SocketAdapter";
import { Namespace } from "socket.io";

class TicTacToeLobby{
    private gameRoomManager: GameRoomManager
    private activeGames: TicTacToe[]

    constructor()
    {
        this.gameRoomManager = new GameRoomManager("tic-tac-toe")
        this.activeGames = []
    }

    public startNewGame(room:GameRoom){
        let game : TicTacToe = new TicTacToe(this.gameRoomManager.getIo(), room)
        this.activeGames.push(game);
    }
}

export default TicTacToeLobby