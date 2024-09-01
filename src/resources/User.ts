import { Socket } from 'socket.io';

export type UserWithoutSocket = {
    id: string;
    username: string;
};

class User {
    id: string;
    username: string;
    socket: Socket;
    timeoutId?: NodeJS.Timeout;

    constructor(id: string, username: string, socket: Socket) {
        this.id = id;
        this.username = username;
        this.socket = socket;
    }

    public getUserData(): UserWithoutSocket {
        return {
            id: this.id,
            username: this.username,
        };
    }

    public setTimeoutId(timeoutId: NodeJS.Timeout) {
        this.timeoutId = timeoutId;
    }

    public clearTimeoutId() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.timeoutId = undefined;
    }

    public setSocket(socket: Socket) {
        this.socket = socket;
    }

    public toJSON() {
        return this.getUserData();
    }
}

export default User;
