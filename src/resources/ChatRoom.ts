import User from './User';

class ChatRoom {
    private id: string;
    private name: string;
    private users: User[];

    constructor(name: string) {
        this.id = name;
        this.name = name;
        this.users = [];
    }

    public addUser(user: User) {
        this.users.push(user);
    }

    public removeUser(user: User) {
        this.users = this.users.filter((u) => u !== user);
    }

    public getName(): string {
        return this.name;
    }

    public getUsers(): User[] {
        return this.users;
    }
}

export default ChatRoom;
