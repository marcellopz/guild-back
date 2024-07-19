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

    public line_check(line:number, symbol:string) : number{
        var count : number = 0;
        for (var j: number = 0; j < 3; j++){
            var actual_symbol : string = this.hash[line][j].get_simbol()
            if (actual_symbol == symbol){
                count++;
            }
            else{
                return 0
            }
        }
        return count;
    }

    public column_check(column:number, symbol:string) : number{
        var count : number = 0;
        for (var i: number = 0; i < 3; i++){
            var actual_symbol : string = this.hash[i][column].get_simbol()
            if (actual_symbol == symbol){
                count++;
            }
            else{
                return 0
            }
        }
        return count;
    }

    public main_diagonal_check(symbol:string){
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
                        return 0;
                    }
                }
            }
        }
        return count;
    }

    public secondary_diagonal_check(symbol:string){
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
                        return 0;
                    }
                }
            }
        }
        return count;
    }
}

export default Hash