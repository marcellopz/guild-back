import { Socket } from 'socket.io';

export type UserWithoutSocket = {
    id: string;
    username: string;
};

class User {
    id: string;
    username: string;
    socket: Socket;

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

    public toJSON() {
        return this.getUserData();
    }
}

export default User;
