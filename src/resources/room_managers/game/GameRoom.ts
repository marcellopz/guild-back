import User from '../../User';

class GameRoom {
    private name: string;
    private password: string;
    private owner: User;
    private users: User[];
    private players: User[];
    private spectators: User[];

    constructor(name: string, password: string, owner: User) {
        this.name = name;
        this.password = password;
        this.owner = owner;
        this.users = [owner];
        this.players = [owner];
        this.spectators = [];
    }

    public addPlayer(player: User) {
        if (!this.players.find((p) => p.id === player.id)) {
            this.players.push(player);
        }
    }

    public removePlayer(player: User) {
        this.players = this.players.filter((p) => p !== player);
    }

    public addSpectator(spectator: User) {
        if (!this.spectators.find((s) => s.id === spectator.id)) {
            this.spectators.push(spectator);
        }
    }

    public removeSpectator(spectator: User) {
        this.spectators = this.spectators.filter((s) => s !== spectator);
    }

    public addUser(user: User) {
        if (!this.users.find((u) => u.id === user.id)) {
            this.users.push(user);
        }
    }

    public removeUser(user: User) {
        this.users = this.users.filter((u) => u !== user);
    }

    public getName(): string {
        return this.name;
    }

    public getPlayers(): User[] {
        return this.players;
    }

    public getUsers(): User[] {
        return this.users;
    }

    public getUser(userId: string): User | undefined {
        return this.users.find((u) => u.id === userId);
    }

    public getPassword(): string {
        return this.password;
    }

    public getOwner(): User {
        return this.owner;
    }

    public setOwner(owner: User) {
        this.owner = owner;
    }
}

export default GameRoom;
