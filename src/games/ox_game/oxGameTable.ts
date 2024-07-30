import OxGameCard from "./oxGameCard";
import OxGameTableLine from "./oxGameTableLine";

const lineCount = 4

class OxGameTable{
    private _tableLines: OxGameTableLine[];

    constructor(){
        this._tableLines = [];
        this.createTable();
    }

    private createTable() {
        for (var i: number = 0; i < lineCount; i++) {
            this._tableLines.push(new OxGameTableLine())
        }
    }

    public getLines(): OxGameTableLine[]{
        return this._tableLines;
    }

    public getPossibleLines(card:OxGameCard): OxGameTableLine[]{
        let possibleLines: OxGameTableLine[] = [];
        this._tableLines.forEach(line => {
            let actualCard = line.getLastCard();
            if (!actualCard) return;
            if (card.getValue() > actualCard.getValue()){
                possibleLines.push(line);
            }
        });
        return possibleLines;
    }

    public getHigherValueLine(lines:OxGameTableLine[]):OxGameTableLine{
        let higherLastCardValueLine:OxGameTableLine = lines[0];
        let lastLineChecked:OxGameTableLine = lines[0];
        let lastLineCheckedLastCard = lastLineChecked.getLastCard();

        lines.forEach(line => {
            let lineLastCard = line.getLastCard();
            if (!lastLineCheckedLastCard || !lineLastCard) return;
            if (lastLineCheckedLastCard.getValue() > lineLastCard.getValue()){
                higherLastCardValueLine = lastLineChecked;
            }
            else
            {
                higherLastCardValueLine = line;
            }
            lastLineCheckedLastCard = lineLastCard;
        });

        return higherLastCardValueLine;
    }
}

export default OxGameTable