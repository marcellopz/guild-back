import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import User from '@/resources/user/user.interface';

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    { timestamps: true },
);

UserSchema.pre<User>('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;

    next();
});

UserSchema.methods.isValidPassword = async function (
    password: string,
): Promise<Error | boolean> {
    const user = this;
    return bcrypt.compare(password, user.password);
};

export default model<User>('User', UserSchema);
