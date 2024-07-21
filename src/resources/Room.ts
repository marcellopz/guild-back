import User from "./User";

class Room{
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
}

export default Room;