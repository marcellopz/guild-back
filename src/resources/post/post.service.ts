import PostModel from '@/resources/post/post.model';
import Post from '@/resources/post/post.interface';

class PostService {
    private post = PostModel;

    /**
     * create a new post
     */
    public async create(title: string, body: string): Promise<Post> {
        try {
            const createdPost = await PostModel.create({ title, body });
            return createdPost;
        } catch (error: any) {
            throw new Error(error.message ?? 'Error creating post');
        }
    }
}

export default PostService;
