import UserModel from '@/resources/user/user.model';
import token from '@/utils/token';

class UserService {
    private user = UserModel;

    /**
     * Register a new user
     */
    async register(
        name: string,
        email: string,
        password: string,
        role: string = 'user',
    ): Promise<string | Error> {
        try {
            const user = await this.user.create({
                name,
                email,
                password,
            });
            const accessToken = token.createToken(user);

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
    async login(email: string, password: string): Promise<string | Error> {
        try {
            const user = await this.user.findOne({ email });
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
