import HashTile from "./hashTile";

class Hash {
    private hash: HashTile[][]

    constructor() {
        this.hash = [];

        this.buildHash();
    }

    private buildHash() {
        for (var i: number = 0; i < 3; i++) {
            this.hash[i] = [];
            for (var j: number = 0; j < 3; j++) {
                this.hash[i][j] = new HashTile(i, j);
            }
        }
    }

    public checkCoordinate(coordinate:number[], symbol:string){
        if (this.lineCheck(coordinate[0], symbol)){
            return true;
        }

        if (this.columnCheck(coordinate[1], symbol)){
            return true;
        }

        if (coordinate[0] == coordinate[1] && this.mainDiagonalCheck(symbol)){
            return true;
        }

        if (coordinate[0] + coordinate[1] == 2 && this.secondaryDiagonalCheck(symbol))
        {
            return true;
        }

        return false;
    }

    public lineCheck(line:number, symbol:string) : boolean{
        var count : number = 0;
        for (var j: number = 0; j < 3; j++){
            var actual_symbol : string = this.hash[line][j].getSymbol()
            if (actual_symbol == symbol){
                count++;
            }
            else{
                return false
            }
        }

        if (count == 3){
            return true;
        }
        else
        {
            return false;
        }
    }

    public columnCheck(column:number, symbol:string) : boolean{
        var count : number = 0;
        for (var i: number = 0; i < 3; i++){
            var actual_symbol : string = this.hash[i][column].getSymbol()
            if (actual_symbol == symbol){
                count++;
            }
            else{
                return false
            }
        }

        if (count == 3){
            return true;
        }
        else
        {
            return false;
        }
    }

    public mainDiagonalCheck(symbol:string) : boolean{
        var count : number = 0;
        for (var i: number = 0; i < 3; i++) {
            this.hash[i] = [];
            for (var j: number = 0; j < 3; j++) {
                if (i == j){
                    var actual_symbol : string = this.hash[i][j].getSymbol()

                    if (actual_symbol == symbol){
                        count++;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
        }

        if (count == 3){
            return true;
        }
        else
        {
            return false;
        }
    }

    public secondaryDiagonalCheck(symbol:string) : boolean{
        var count : number = 0;
        for (var i: number = 0; i < 3; i++) {
            this.hash[i] = [];
            for (var j: number = 0; j < 3; j++) {
                if (i + j == 2){
                    var actual_symbol : string = this.hash[i][j].getSymbol()

                    if (actual_symbol == symbol){
                        count++;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
        }

        if (count == 3){
            return true;
        }
        else
        {
            return false;
        }
    }
}

export default Hash