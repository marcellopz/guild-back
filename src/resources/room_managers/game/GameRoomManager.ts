import { Namespace, Socket } from 'socket.io';
import SocketAdapter from '../../SocketAdapter';
import GameRoom from './GameRoom';
import User from '../../User';
import TicTacToeLobby from 'lobby/ticTacToeLobby';

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
            socket.emit('existing_rooms', this.getExistingRooms());
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
                    // Criar nova sala
                    if (rooms.length === 0) {
                        this.createNewRoom(roomName, password, user);
                    }
                    // Entrar em sala existente
                    else {
                        let gameRoom: GameRoom = rooms[0];
                        this.joinExistingRoom(gameRoom, password, user);
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
            (message: { message: string; user: any; createdAt: string }) => {
                // user enviado pelo front
                this.io
                    .to(gameRoom.getName())
                    .emit('back_new_message', message);
            },
        );
    }

    public createNewRoom(name: string, password: string, owner: User) {
        let gameRoom: GameRoom = new GameRoom(
            name,
            password,
            owner,
        );
        this.rooms.push(gameRoom);
        this.io.emit('existing_rooms', this.getExistingRooms());
        owner.socket.join(gameRoom.getName());
        owner.socket.on('start_game', () => {
            this.lobby.startNewGame(gameRoom, owner.socket);
        });
        this.joinedRoomSocketSignals(owner.socket, owner, gameRoom);
    }

    public joinExistingRoom(room:GameRoom, password:string, user:User) {
        if (room.getPassword() === password) {
            room.addUser(user);
            if (
                this.lobby.getMaxPlayers() >
                room.getPlayers().length
            ) {
                room.addPlayer(user);
            } else {
                room.addSpectator(user);
            }
            user.socket.join(room.getName());
            this.joinedRoomSocketSignals(
                user.socket,
                user,
                room,
            );
            this.io.emit('room_info', removePassword(room));
            this.io.emit(
                'existing_rooms',
                this.getExistingRooms(),
            );
            this.io.to(room.getName()).emit(
                'game_users_online',
                room.getUsers().map((u) => u.getUserData()),
            );
        } else {
            user.socket.emit('wrong_password');
        }
    }

    public onPlayerJoin(socket: Socket, room: string) {
        socket.join(room);
    }

    public getIo(): Namespace {
        return this.io;
    }
}

export default GameRoomManager;
