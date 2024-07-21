import { Server as SocketIOServer, Socket, Namespace } from 'socket.io';
import SocketAdapter from "./SocketAdapter";
import GameRoom from "./GameRoom";
import { ServerManager } from "./ServerManager";
import ChatRoom from "./ChatRoom";
import User from './User';

class ChatRoomManager{
    private serverManager: ServerManager
    private io : Namespace
    private rooms:ChatRoom[]

    constructor(){
        this.rooms = []
        this.serverManager = ServerManager.getInstance();
        this.io = SocketAdapter.io.of("/chat");
    }

    public initializeChatRoomManager(){
        this.io.on("connection", (socket) => {
            socket.on("join_room", (roomNumber) => {
                let chatRoom:ChatRoom = this.rooms[roomNumber]
                socket.join(chatRoom.getName());
                let user:User | undefined= this.serverManager.getUserBySocketID(socket.id);
                if (user === undefined) return;
                chatRoom.addUser(user)
                socket.emit("test", "Deu bom!");
            })
        })
    }

    public createRooms(){
        for(var i = 0; i < 5; i++){
            this.rooms.push(
                new ChatRoom("Chat"+i)
            )
        }
    }

    public onPlayerJoin(socket:Socket, room:string){
        socket.join(room);
    }
}

export default ChatRoomManager;