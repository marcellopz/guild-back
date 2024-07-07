import UserModel from '@/resources/user/user.model';
import token from '@/utils/token';

class UserService {
    private user = UserModel;

    /**
     * Register a new user
     */
    async register(
        username: string,
        password: string,
        role: string = 'user',
    ): Promise<string | Error> {
        try {
            const user = await this.user.create({
                username,
                password,
            });
            console.log('user', user);
            const accessToken = token.createToken(user);
            console.log('accessToken', accessToken);

            return accessToken;
        } catch (error: any) {
            return new Error(
                error.message ?? 'An error occurred while registering the user',
            );
        }
    }

    /**
     * Login a user
     */
    async login(username: string, password: string): Promise<string | Error> {
        try {
            const user = await this.user.findOne({ username });
            if (!user) {
                return new Error('User not found');
            }

            const isValidPassword = await user.isValidPassword(password);
            if (!isValidPassword) {
                return new Error('Invalid password');
            }

            const accessToken = token.createToken(user);

            return accessToken;
        } catch (error: any) {
            return new Error(
                error.message ?? 'An error occurred while logging in the user',
            );
        }
    }
}

export default UserService;
