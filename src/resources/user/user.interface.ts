import { Document } from 'mongoose';

export default interface User extends Document {
    email: string;
    password: string;
    name: string;
    role: string;

    isValidPassword(password: string): Promise<boolean>;
}
