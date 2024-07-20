import { Server as SockerIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { allowedOrigins } from '../app';

interface User {
    id: string;
    username: string;
    socketId: string;
}

class Socket {
    private static io: SockerIOServer;
    public usersOnline: Record<string, User> = {};

    constructor(httpServer: HTTPServer) {
        Socket.io = new SockerIOServer(httpServer, {
            cors: {
                origin: allowedOrigins,
                credentials: true,
            },
        });
        this.initializeSocketIO();
    }

    private initializeSocketIO(): void {
        Socket.io.on('connection', (socket) => {
            socket.on(
                'join_server',
                (user_?: { username: string; userId: string }) => {
                    if (!user_) return;
                    this.usersOnline[user_.userId] = {
                        id: user_.userId,
                        username: user_.username,
                        socketId: socket.id,
                    };
                    Socket.io.emit('users_online', this.usersOnline); // Socket.io emite para todos os usuários
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
                Socket.io.emit('users_online', this.usersOnline); // Socket.io emite para todos os usuários
            };
            socket.on('disconnect', removeUser);
            socket.on('logout', removeUser);
            socket.emit('users_online', this.usersOnline); // socket.emit emite apenas para o usuário que se conectou
            console.log('Client connected', socket.id);
        });
    }
}

export default Socket;
