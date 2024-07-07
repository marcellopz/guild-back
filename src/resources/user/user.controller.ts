import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';
import authenticated from '@/middleware/authenticated.middleware';

class UserController implements Controller {
    public path = '/auth';
    public router = Router();
    private userService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register,
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login,
        );
        this.router.get(`${this.path}`, authenticated, this.getUser);
        this.router.post(`${this.path}/logout`, this.logout);
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { username, password } = req.body;
            const token = await this.userService.register(
                username,
                password,
                'user',
            );
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error: any) {
            next(
                new HttpException(
                    400,
                    error?.message ??
                        'An error occurred while registering the user',
                ),
            );
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { username, password } = req.body;
            const token = await this.userService.login(username, password);
            if (token instanceof Error) {
                return next(new HttpException(401, token.message));
            }
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });
            res.status(200).json({ message: 'Logged in successfully' });
        } catch (error: any) {
            next(
                new HttpException(
                    400,
                    error?.message ??
                        'An error occurred while logging in the user',
                ),
            );
        }
    };

    private logout = (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Response | void => {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error: any) {
            next(
                new HttpException(
                    400,
                    error?.message ??
                        'An error occurred while logging out the user',
                ),
            );
        }
    };

    private getUser = (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Response | void => {
        if (!req.user) {
            return next(new HttpException(404, 'User not found'));
        }

        res.status(200).json({ user: req.user });
    };
}

export default UserController;
