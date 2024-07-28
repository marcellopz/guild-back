import { Namespace } from "socket.io";
import HashGameLogic from "./TicTacToeLogic";
import HashGameNetwork from "./TicTacToeNetwork";
import GameRoom from "@/resources/room_managers/game/GameRoom";

class TicTacToe{
    private gameLogic: HashGameLogic;
    private gameNetwork: HashGameNetwork;

    constructor(io:Namespace, room:GameRoom){
        this.gameNetwork = new HashGameNetwork(io, room);

        let players = this.gameNetwork.createPlayersFromRoom(room);

        this.gameLogic = new HashGameLogic(players);
    }
}

export default TicTacToe;