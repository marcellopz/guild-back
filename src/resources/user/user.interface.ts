import { Document } from 'mongoose';

export default interface User extends Document {
    username: string;
    password: string;
    role: string;

    isValidPassword(password: string): Promise<boolean>;
}
