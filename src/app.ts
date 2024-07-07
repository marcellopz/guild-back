import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import Controller from '@/utils/interfaces/controller.interface';
import errorMiddleware from '@/middleware/error.middleware';

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

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initializeDatabaseConnection();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);

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

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

export default App;
