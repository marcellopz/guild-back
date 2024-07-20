import HashTile from "./hash_tile";

class Hash {
    private hash: HashTile[][]

    constructor() {
        this.hash = [];

        this.build_hash();
    }

    private build_hash() {
        for (var i: number = 0; i < 3; i++) {
            this.hash[i] = [];
            for (var j: number = 0; j < 3; j++) {
                this.hash[i][j] = new HashTile(i, j);
            }
        }
    }

    public check_coordinate(coordinate:number[], symbol:string){
        if (this.line_check(coordinate[0], symbol)){
            return true;
        }

        if (this.column_check(coordinate[1], symbol)){
            return true;
        }

        if (coordinate[0] == coordinate[1] && this.main_diagonal_check(symbol)){
            return true;
        }

        if (coordinate[0] + coordinate[1] == 2 && this.secondary_diagonal_check(symbol))
        {
            return true;
        }

        return false;
    }

    public line_check(line:number, symbol:string) : boolean{
        var count : number = 0;
        for (var j: number = 0; j < 3; j++){
            var actual_symbol : string = this.hash[line][j].get_simbol()
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

    public column_check(column:number, symbol:string) : boolean{
        var count : number = 0;
        for (var i: number = 0; i < 3; i++){
            var actual_symbol : string = this.hash[i][column].get_simbol()
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

    public main_diagonal_check(symbol:string) : boolean{
        var count : number = 0;
        for (var i: number = 0; i < 3; i++) {
            this.hash[i] = [];
            for (var j: number = 0; j < 3; j++) {
                if (i == j){
                    var actual_symbol : string = this.hash[i][j].get_simbol()

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

    public secondary_diagonal_check(symbol:string) : boolean{
        var count : number = 0;
        for (var i: number = 0; i < 3; i++) {
            this.hash[i] = [];
            for (var j: number = 0; j < 3; j++) {
                if (i + j == 2){
                    var actual_symbol : string = this.hash[i][j].get_simbol()

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