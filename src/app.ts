import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import Controller from '@/utils/interfaces/controller.interface';
import errorMiddleware from '@/middleware/error.middleware';
import Hash from './games/hash_game/hash';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SockerIOServer } from 'socket.io';

const allowedOrigins = [
    'http://localhost:5173',
    'guild-games.vercel.app',
    'https://guild-games.vercel.app',
    'http://guild-games.vercel.app',
]; // Add other origins as needed

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin || true);
        } else {
            callback(new Error('Origin not allowed by CORS'));
        }
    },
    credentials: true,
};

interface User {
    id: string;
    username: string;
    socketId: string;
}

class App {
    public express: Application;
    public port: number;
    public hash: Hash;
    public httpServer: HTTPServer;
    public io: SockerIOServer;
    private usersOnline: Record<string, User> = {};

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;
        this.hash = new Hash();
        this.httpServer = createServer(this.express);
        this.io = new SockerIOServer(this.httpServer, {
            cors: {
                origin: allowedOrigins,
                credentials: true,
            },
        });

        this.initializeDatabaseConnection();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeSocketIO();

        // Error handling middleware should be loaded after the loading the controllers
        this.initializeErrorHandling();
    }

    private initializeMiddlewares(): void {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(compression());
        this.express.use(cors(corsOptions));
        this.express.use(helmet());
        this.express.use(morgan('dev'));
        this.express.use(cookieParser());
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.express.use('/api', controller.router);
        });
    }

    private initializeErrorHandling(): void {
        this.express.use(errorMiddleware);
    }

    private initializeDatabaseConnection(): void {
        const { MONGO_URI } = process.env;
        if (!MONGO_URI) {
            throw new Error('Mongo URI is not defined');
        }
        mongoose
            .connect(MONGO_URI)
            .then(() => {
                console.log('Database connected');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    private initializeSocketIO(): void {
        this.io.on('connection', (socket) => {
            socket.on(
                'join_server',
                (user_?: { username: string; userId: string }) => {
                    if (!user_) return;
                    this.usersOnline[user_.userId] = {
                        id: user_.userId,
                        username: user_.username,
                        socketId: socket.id,
                    };
                    this.io.emit('users_online', this.usersOnline); // this.io emite para todos os usuários
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
                this.io.emit('users_online', this.usersOnline); // this.io emite para todos os usuários
            };
            socket.on('disconnect', removeUser);
            socket.on('logout', removeUser);
            socket.emit('users_online', this.usersOnline); // socket.emit emite apenas para o usuário que se conectou
            console.log('Client connected', socket.id);
        });
    }

    public listen(): void {
        this.httpServer.listen(this.port, () => {
            console.log(
                `Server running on port ${this.port} - render: ${process.env.RENDER}`,
            );
        });
    }
}

export default App;
