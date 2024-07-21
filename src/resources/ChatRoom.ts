import User from "./User";

class ChatRoom{
    private id:string;
    private name:string;
    private users:User[];

    constructor(name:string,){
        this.id = name;
        this.name = name;
        this.users = []
    }

    public addUser(user:User){
        this.users.push(user);
    }

    public getName():string{
        return this.name;
    }
}

export default ChatRoom;