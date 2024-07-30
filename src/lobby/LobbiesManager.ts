import SocketAdapter from '@/resources/SocketAdapter';
import TicTacToeLobby from './ticTacToeLobby';

class LobbiesManager {
    public ticTacToeLobby: TicTacToeLobby;
    constructor() {
        this.ticTacToeLobby = new TicTacToeLobby();
    }
}

export default LobbiesManager;
