import { Namespace, Socket } from "socket.io";
import SocketAdapter from "../../SocketAdapter";
import GameRoom from "./GameRoom";
import { ServerManager } from "../../ServerManager";
import User from "../../User";

class GameRoomManager{
    private rooms:GameRoom[]
    private io: Namespace;

    constructor(namespace : string){
        this.rooms = []
        this.io = SocketAdapter.io.of('/' + namespace);
        this.initializeGameRoomManager();
    }

    public initializeGameRoomManager() {
        this.io.on('connection', (socket) => {
            socket.on(
                'join_gameroom',
                (
                    roomName: string,
                    password: string,
                    userData: { username: string; userId: string },
                ) => {
                    let user = new User(
                        userData.userId,
                        userData.username,
                        socket.id,
                    );
                    if (user === undefined) return;
                    let room = this.rooms.filter((room)=> room.getName() === roomName);
                    // Criar nova sala
                    if (room.length === 0){
                        let gameRoom: GameRoom = new GameRoom(roomName, password, user);
                        socket.join(gameRoom.getName());
                        
                        gameRoom.addUser(user);
                        this.joinedRoomSocketSignals(socket, user, gameRoom);
                    }
                    // Entrar em sala existente
                    else{
                        
                    }
                },
            );
        });
    }

    public joinedRoomSocketSignals(
        socket: Socket,
        user: User,
        gameRoom: GameRoom,
    ) {
        this.io
            .to(gameRoom.getName())
            .emit('game_users_online', gameRoom.getUsers());
        socket.on('disconnect', () => {
            gameRoom.removeUser(user);
            this.io
                .to(gameRoom.getName())
                .emit('game_users_online', gameRoom.getUsers());
        });
        socket.on(
            'front_new_message',
            (message: { message: string; user: User; createdAt: string }) => {
                this.io
                    .to(gameRoom.getName())
                    .emit('back_new_message', message);
            },
        );
    }

    // public onPlayerCreateRoom(socket:Socket, roomName:string, password:string){
    //     var user = this.serverManager.getUserBySocketID(socket.id);
        
    //     if (user == undefined) return;
        
    //     socket.join(roomName);

    //     this.rooms.push(
    //         new GameRoom(roomName, password, user)
    //     )
    // }

    public onPlayerJoin(socket:Socket, room:string){
        socket.join(room);
    }
}

export default GameRoomManager;