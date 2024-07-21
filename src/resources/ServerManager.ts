import { Server as SocketIOServer } from 'socket.io';
import SocketAdapter from './SocketAdapter';
import User from './User';

export class ServerManager {
    public static instance: ServerManager;
    public usersOnline: Record<string, User>;
    public io: SocketIOServer;

    private constructor() {
        this.usersOnline = {};
        this.io = SocketAdapter.io;
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

    public getUserBySocketID(socketID: string) {
        const user = Object.values(this.usersOnline).find(
            (user) => user.socketId === socketID,
        );
        return user;
    }
}
