import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/post/post.validation';
import PostService from '@/resources/post/post.service';

class PostController implements Controller {
    public path = '/posts';
    public router = Router();
    private postService = new PostService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            this.path,
            validationMiddleware(validate.create),
            this.create,
        );

        // this.router.get(this.path, this.getAllPosts);
        // this.router.get(`${this.path}/:id`, this.getPostById);
        // this.router.put(`${this.path}/:id`, validationMiddleware(validate), this.updatePost);
        // this.router.delete(`${this.path}/:id`, this.deletePost);
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { title, body } = req.body;
            const post = await this.postService.create(title, body);
            res.status(201).json({ post });
        } catch (error: any) {
            next(new HttpException(400, error.message ?? 'Bad request'));
        }
    };
}

export default PostController;
