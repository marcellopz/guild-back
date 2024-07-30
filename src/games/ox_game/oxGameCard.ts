import { OxGamePlayer } from "./oxGamePlayer";

class OxGameCard {
    private _owner: OxGamePlayer | null = null;
    private _value: number;

    constructor(value: number) {
        this._value = value;
    }

    public getValue(): number {
        return this._value;
    }

    public setOwner(owner: OxGamePlayer){
        this._owner = owner;
    }

    public getOwner(): OxGamePlayer | null{
        return this._owner;
    }
}

export default OxGameCard