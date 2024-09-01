import { Namespace, Socket } from 'socket.io';
import SocketAdapter from '../../SocketAdapter';
import GameRoom from './GameRoom';
import User from '../../User';
import TicTacToeLobby from 'lobby/ticTacToeLobby';

const TIMEOUT_DURATION = 1000 * 2; // 2 seconds

function removePassword(room: GameRoom) {
    return {
        name: room.getName(),
        owner: room.getOwner().getUserData(),
        users: room.getUsers().map((u) => u.getUserData()),
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
            socket.onAny((event, ...args) => {
                console.log(event, args);
            });
            socket.emit('existing_rooms', this.getExistingRooms());
            socket.on(
                'create_gameroom',
                (
                    roomName: string,
                    password: string,
                    userData: { username: string; userId: string },
                ) => {
                    let user = new User(
                        userData?.userId,
                        userData?.username,
                        socket,
                    );
                    this.createNewRoom(roomName, password, user);
                },
            );
            socket.on(
                'join_gameroom',
                (
                    roomName: string,
                    password: string,
                    userData: { username: string; userId: string },
                ) => {
                    let user = new User(
                        userData?.userId,
                        userData?.username,
                        socket,
                    );
                    if (user === undefined) return;
                    let rooms = this.rooms.filter(
                        (rooms) => rooms.getName() === roomName,
                    );
                    if (rooms.length === 0) {
                        return;
                        // this.createNewRoom(roomName, password, user);
                    }
                    // Entrar em sala existente
                    else {
                        let gameRoom: GameRoom = rooms[0];
                        this.joinExistingRoom(gameRoom, password, user);
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
        socket.on('get_room', (roomName) => {
            const room = this.getRoomByName(roomName);
            if (room === undefined) return;
            socket.emit('room_info', room);
        });

        this.io
            .to(gameRoom.getName())
            .emit('room_info', removePassword(gameRoom));

        socket.on('leave_gameroom', () => {
            this.onPlayerLeave(gameRoom, user);
        });

        socket.removeAllListeners('disconnect');
        socket.on('disconnect', () => {
            console.log('User disconnected');
            const timeoutId = setTimeout(() => {
                this.onPlayerLeave(gameRoom, user);
            }, TIMEOUT_DURATION);
            gameRoom.getUser(user.id)?.setTimeoutId(timeoutId);
        });

        socket.removeAllListeners('front_new_message');
        socket.on(
            'front_new_message',
            (message: { message: string; user: any; createdAt: string }) => {
                // user enviado pelo front
                this.io
                    .to(gameRoom.getName())
                    .emit('back_new_message', message);
            },
        );
    }

    public createNewRoom(name: string, password: string, owner: User) {
        let gameRoom: GameRoom = new GameRoom(name, password, owner);
        this.rooms.push(gameRoom);
        this.io.emit('existing_rooms', this.getExistingRooms());
        owner.socket.join(gameRoom.getName());
        owner.socket.on('start_game', () => {
            this.lobby.startNewGame(gameRoom, owner.socket);
        });
        owner.socket.emit('join_gameroom_response', name);
        // this.joinedRoomSocketSignals(owner.socket, owner, gameRoom);
    }

    public joinExistingRoom(room: GameRoom, password: string, user: User) {
        const userInRoom = room.getUser(user.id);
        if (userInRoom) {
            userInRoom.clearTimeoutId(); // Clear timeout if user is already in room
            userInRoom.setSocket(user.socket);
            user.socket.join(room.getName());
            user.socket.emit('join_gameroom_response', room.getName());
            this.joinedRoomSocketSignals(user.socket, user, room);
            return;
        }

        if (room.getPassword() === password || userInRoom) {
            user.socket.emit('join_gameroom_response', room.getName());
            room.addUser(user);
            if (this.lobby.getMaxPlayers() > room.getPlayers().length) {
                room.addPlayer(user);
            } else {
                room.addSpectator(user);
            }
            user.socket.join(room.getName());
            this.joinedRoomSocketSignals(user.socket, user, room);
            this.io.emit('room_info', removePassword(room));
            this.io.emit('existing_rooms', this.getExistingRooms());
            this.io
                .to(room.getName())
                .emit('game_users_online', room.getUsers());
        } else {
            user.socket.emit('wrong_password', false);
        }
    }

    public onPlayerLeave(gameRoom: GameRoom, user: User) {
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
    }

    public onPlayerJoin(socket: Socket, room: string) {
        socket.join(room);
    }

    public getIo(): Namespace {
        return this.io;
    }
}

export default GameRoomManager;
