import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/token';
import UserModel from '@/resources/user/user.model';
import Token from '@/utils/interfaces/token.interface';
import HttpException from '@/utils/exceptions/http.exception';
import jwt from 'jsonwebtoken';

async function authenticatedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> {
    console.log(process.env);
    console.log(req.cookies?.token);
    const token = req.cookies?.token ?? '';

    if (!token) {
        return next(new HttpException(401, 'Unauthorized'));
    }

    try {
        const payload: Token | jwt.JsonWebTokenError = await verifyToken(token);

        if (payload instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401, 'Invalid token'));
        }

        const user = await UserModel.findById(payload.id)
            .select('-password')
            .exec();

        if (!user) {
            return next(new HttpException(401, 'User not found'));
        }

        req.user = user;
        return next();
    } catch (error) {
        return next(new HttpException(401, 'Unauthorized'));
    }
}

export default authenticatedMiddleware;
