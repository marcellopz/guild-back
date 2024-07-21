import { Socket } from "socket.io";
import SocketAdapter from "./SocketAdapter";
import GameRoom from "./GameRoom";
import { ServerManager } from "./ServerManager";

class GameRoomManager{
    private serverManager: ServerManager
    private rooms:GameRoom[]

    constructor(){
        this.rooms = []
        this.serverManager = ServerManager.getInstance();
    }

    public onPlayerCreateRoom(socket:Socket, roomName:string, password:string){
        var user = this.serverManager.getUserBySocketID(socket.id);
        
        if (user == undefined) return;
        
        socket.join(roomName);

        this.rooms.push(
            new GameRoom(roomName, password, user)
        )
    }

    public onPlayerJoin(socket:Socket, room:string){
        socket.join(room);
    }
}

export default GameRoomManager;