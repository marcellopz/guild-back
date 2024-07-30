import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { allowedOrigins } from '../app';
import { ServerManager } from './ServerManager';
import User from './User';

class SocketAdapter {
    public static io: SocketIOServer;
    public serverManager: ServerManager;

    constructor(httpServer: HTTPServer) {
        SocketAdapter.io = new SocketIOServer(httpServer, {
            cors: {
                origin: allowedOrigins,
                credentials: true,
            },
        });
        this.initializeSocketIO();
        this.serverManager = ServerManager.getInstance();
    }

    private initializeSocketIO(): void {
        SocketAdapter.io.on('connection', (socket) => {
            socket.on(
                'join_server',
                (user_?: { username: string; userId: string }) => {
                    if (!user_) return;
                    this.serverManager.usersOnline[user_.userId] = new User(
                        user_.userId,
                        user_.username,
                        socket,
                    );
                    SocketAdapter.io.emit(
                        'users_online',
                        this.serverManager.usersOnline,
                    ); // Socket.io emite para todos os usuários
                },
            );
            socket.on('message', (message) =>
                console.log('Message received', message),
            );
            const removeUser = () => {
                console.log('Client disconnected', socket.id);
                const user = Object.values(this.serverManager.usersOnline).find(
                    (user) => user.socket.id === socket.id,
                );
                if (!user) return;
                delete this.serverManager.usersOnline[user.id];
                SocketAdapter.io.emit(
                    'users_online',
                    this.serverManager.usersOnline,
                ); // Socket.io emite para todos os usuários
            };
            socket.on('disconnect', removeUser);
            socket.on('logout', removeUser);
            socket.emit(
                'users_online',
                this.serverManager.usersOnline,
            ); // socket.emit emite apenas para o usuário que se conectou
            console.log('Client connected', socket.id);
        });
    }
}

export default SocketAdapter;
