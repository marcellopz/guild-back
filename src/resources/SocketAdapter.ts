import { Server as SockerIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { allowedOrigins } from '../app';
import RoomManager from './RoomManager';
import SocketClient from './SocketClient';
import User, { IUser } from './User';


class SocketAdapter {
    public static io: SockerIOServer;
    public usersOnline: Record<string, IUser> = {};

    constructor(httpServer: HTTPServer) {
        SocketAdapter.io = new SockerIOServer(httpServer, {
            cors: {
                origin: allowedOrigins,
                credentials: true,
            },
        });
        this.initializeSocketIO();
    }

    private initializeSocketIO(): void {
        
        SocketAdapter.io.on('connection', (socket) => {
            socket.on(
                'join_server',
                (user_?: { username: string; userId: string }) => {
                    if (!user_) return;
                    this.usersOnline[user_.userId] = {
                        id: user_.userId,
                        username: user_.username,
                        socketId: socket.id,
                    };
                    SocketAdapter.io.emit('users_online', this.usersOnline); // Socket.io emite para todos os usuários
                },
            );
            socket.on('message', (message) =>
                console.log('Message received', message),
            );
            const removeUser = () => {
                console.log('Client disconnected', socket.id);
                const user = Object.values(this.usersOnline).find(
                    (user) => user.socketId === socket.id,
                );
                if (!user) return;
                delete this.usersOnline[user.id];
                SocketAdapter.io.emit('users_online', this.usersOnline); // Socket.io emite para todos os usuários
            };
            socket.on('disconnect', removeUser);
            socket.on('logout', removeUser);
            socket.emit('users_online', this.usersOnline); // socket.emit emite apenas para o usuário que se conectou
            console.log('Client connected', socket.id);
        });
    }


    public getUserBySocketID(socketID:string){
        const user = Object.values(this.usersOnline).find(
            (user) => user.socketId === socketID,
        );
        return user;
    }
}

export default SocketAdapter;
