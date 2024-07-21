import { Socket } from "socket.io";
import SocketAdapter from "./SocketAdapter";
import Room from "./Room";

class RoomManager{
    private rooms:Room[]

    constructor(){
        this.rooms = []
    }

    public onPlayerCreateRoom(socket:Socket, roomName:string, password:string){
        // this.rooms.push(
        //     new Room(roomName, password, SocketAdapter.g)
        // )
    }

    public onPlayerJoin(socket:Socket, room:string){
        socket.join(room);
    }
}

export default RoomManager;