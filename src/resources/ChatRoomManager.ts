import { Socket, Namespace } from 'socket.io';
import SocketAdapter from './SocketAdapter';
import { ServerManager } from './ServerManager';
import ChatRoom from './ChatRoom';
import User from './User';

class ChatRoomManager {
    private serverManager: ServerManager;
    private io: Namespace;
    private rooms: ChatRoom[];

    constructor() {
        this.rooms = [];
        this.serverManager = ServerManager.getInstance();
        this.io = SocketAdapter.io.of('/chat');
        this.createRooms();
        this.initializeChatRoomManager();
    }

    public initializeChatRoomManager() {
        this.io.on('connection', (socket) => {
            socket.on(
                'join_room',
                (
                    roomNumber: 1 | 2 | 3 | 4 | 5,
                    userData: { username: string; userId: string },
                ) => {
                    let chatRoom: ChatRoom = this.rooms[roomNumber - 1];
                    socket.join(chatRoom.getName());
                    let user = new User(
                        userData.userId,
                        userData.username,
                        socket.id,
                    );
                    if (user === undefined) return;
                    chatRoom.addUser(user);
                    this.joinedRoomSocketSignals(socket, user, chatRoom);
                },
            );
            socket.on('grilha', (fn) => {
                fn(this.rooms);
            });
        });
    }

    public joinedRoomSocketSignals(
        socket: Socket,
        user: User,
        chatRoom: ChatRoom,
    ) {
        this.io.emit('chat_users_online', chatRoom.getUsers());
        socket.on('disconnect', () => {
            chatRoom.removeUser(user);
            this.io
                .to(chatRoom.getName())
                .emit('chat_users_online', chatRoom.getUsers());
        });
        socket.on(
            'front_new_message',
            (message: { message: string; user: User; createdAt: string }) => {
                this.io
                    .to(chatRoom.getName())
                    .emit('back_new_message', message);
            },
        );
    }

    public createRooms() {
        for (var i = 0; i < 5; i++) {
            this.rooms.push(new ChatRoom('Chat' + (i + 1)));
        }
    }

    public onPlayerJoin(socket: Socket, room: string) {
        socket.join(room);
    }
}

export default ChatRoomManager;
