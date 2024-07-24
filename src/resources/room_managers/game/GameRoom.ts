import User from "../../User";

class GameRoom{
    private id:string;
    private name:string;
    private password:string;
    private owner:User;
    private users:User[];

    constructor(name:string, password:string, owner:User){
        this.id = name;
        this.name = name;
        this.password = password;
        this.owner = owner;
        this.users = [owner]
    }

    public addUser(user:User){
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

    public getPassword():string{
        return this.password;
    }

    public getOwner(): User{
        return this.owner;
    }

    public setOwner(owner:User){
        this.owner = owner;
    }
}

export default GameRoom;