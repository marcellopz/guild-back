export interface IUser {
    id: string;
    username: string;
    socketId: string;
}

class User implements IUser{
    id: string;
    username: string;
    socketId: string;
    
    constructor(id:string, username:string, socketId:string){
        this.id = id;
        this.username = username;
        this.socketId = socketId;
    }
}

export default User;