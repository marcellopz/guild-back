class HashTile{
    private _coordinates : number[]
    private _simbol : string

    constructor(i : number, j : number){
        this._coordinates = [i, j]
        this._simbol = "";
    }

    public get_coordinates() : number[]{
        return this._coordinates;
    }

    public get_simbol() : string{
        return this._simbol
    }

    public set_simbol(simbol:string){
        this._simbol = simbol;
    }
}

export default HashTile;