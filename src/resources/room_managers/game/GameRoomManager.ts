import { Namespace, Socket } from 'socket.io';
import SocketAdapter from '../../SocketAdapter';
import GameRoom from './GameRoom';
import User from '../../User';
import TicTacToeLobby from 'lobby/ticTacToeLobby';

function removePassword(room: GameRoom) {
    return {
        name: room.getName(),
        owner: room.getOwner(),
        users: room.getUsers(),
        hasPassword: room.getPassword() !== '',
    };
}

class GameRoomManager {
    private rooms: GameRoom[];
    private namespace: string;
    private io: Namespace;
    private lobby: TicTacToeLobby;

    constructor(namespace: string, lobby: TicTacToeLobby) {
        this.rooms = [];
        this.namespace = namespace;
        this.io = SocketAdapter.io.of('/' + namespace);
        this.initializeGameRoomManager();
        this.lobby = lobby;
    }

    public getNameSpace() {
        return this.namespace;
    }

    public getExistingRooms() {
        return this.rooms.map(removePassword);
    }

    public getRoomByName(roomName: string) {
        const room = this.rooms.find((room) => room.getName() === roomName);
        if (room === undefined) return undefined;
        return removePassword(room);
    }

    public initializeGameRoomManager() {
        this.io.on('connection', (socket) => {
            socket.emit('existing_rooms', this.getExistingRooms());
            socket.on(
                'join_gameroom',
                (
                    roomName: string,
                    password: string,
                    userData: { username: string; userId: string },
                ) => {
                    // remover eventos depois ?
                    let user = new User(
                        userData?.userId,
                        userData?.username,
                        socket.id,
                    );
                    if (user === undefined) return;
                    let room = this.rooms.filter(
                        (room) => room.getName() === roomName,
                    );
                    // Criar nova sala
                    if (room.length === 0) {
                        let gameRoom: GameRoom = new GameRoom(
                            roomName,
                            password,
                            user,
                        );
                        this.rooms.push(gameRoom);
                        this.io.emit('existing_rooms', this.getExistingRooms());
                        socket.join(gameRoom.getName());
                        socket.on('start_game', () => {
                            this.lobby.startNewGame(gameRoom, socket);
                        });
                        this.joinedRoomSocketSignals(socket, user, gameRoom);
                    }
                    // Entrar em sala existente
                    else {
                        let gameRoom: GameRoom = room[0];
                        if (gameRoom.getPassword() === password) {
                            gameRoom.addUser(user);
                            if (
                                this.lobby.getMaxPlayers() >
                                gameRoom.getPlayers().length
                            ) {
                                gameRoom.addPlayer(user);
                            } else {
                                gameRoom.addSpectator(user);
                            }
                            socket.join(gameRoom.getName());
                            this.joinedRoomSocketSignals(
                                socket,
                                user,
                                gameRoom,
                            );
                            this.io.emit('room_info', removePassword(gameRoom));
                            this.io.emit(
                                'existing_rooms',
                                this.getExistingRooms(),
                            );
                            this.io
                                .to(gameRoom.getName())
                                .emit('game_users_online', gameRoom.getUsers());
                        } else {
                            socket.emit('wrong_password');
                        }
                    }
                },
            );
            socket.on('grilha', () => {
                console.log('rooms', this.rooms);
                console.log('active games', this.lobby.getActiveGames());
            });
        });
    }

    public joinedRoomSocketSignals(
        socket: Socket,
        user: User,
        gameRoom: GameRoom,
    ) {
        socket.on('get_room', (roomName) => {
            const room = this.getRoomByName(roomName);
            if (room === undefined) return;
            socket.emit('room_info', room);
        });

        this.io
            .to(gameRoom.getName())
            .emit('room_info', removePassword(gameRoom));

        socket.on('disconnect', () => {
            if (gameRoom.getOwner().id === user.id) {
                this.rooms = this.rooms.filter(
                    (room) => room.getName() !== gameRoom.getName(),
                );
                this.lobby.deleteGame(gameRoom);
                this.io.to(gameRoom.getName()).emit('room_deleted');
            }

            gameRoom.removeUser(user);
            this.io
                .to(gameRoom.getName())
                .emit('room_info', removePassword(gameRoom));
            this.io.emit('existing_rooms', this.getExistingRooms());
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

    public onPlayerJoin(socket: Socket, room: string) {
        socket.join(room);
    }

    public getIo(): Namespace {
        return this.io;
    }
}

export default GameRoomManager;
