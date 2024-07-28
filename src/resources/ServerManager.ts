import { Server as SocketIOServer } from 'socket.io';
import SocketAdapter from './SocketAdapter';
import User from './User';
import ChatRoomManager from './room_managers/chat/ChatRoomManager';
import LobbiesManager from '../lobby/LobbiesManager';

export class ServerManager {
    public static instance: ServerManager;
    public usersOnline: Record<string, User>;
    public io: SocketIOServer;

    private constructor() {
        this.usersOnline = {};
        this.io = SocketAdapter.io;
        new ChatRoomManager();
        new LobbiesManager();
    }

    public static getInstance(): ServerManager {
        if (!ServerManager.instance) {
            ServerManager.instance = new ServerManager();
        }

        return ServerManager.instance;
    }

    public setUsers(users: Record<string, User>) {
        this.usersOnline = users;
    }
}
