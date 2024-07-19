class HashTile{
    private coordinates : number[]
    private simbol : string

    constructor(i : number, j : number){
        this.coordinates = [i, j]
        this.simbol = "";
    }

    public get_coordinates() : number[]{
        return this.coordinates;
    }

    public get_simbol() : string{
        return this.simbol
    }

    public set_simbol(simbol:string){
        this.simbol = simbol;
    }
}

export default HashTile;