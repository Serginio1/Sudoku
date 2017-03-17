
// Класс с исходным решением и значениями открытых ячеек
export class SudokuCell {
    public Value: number;
    public IsVisible: boolean;

    public constructor(Value: number, IsVisible: boolean) {
        this.Value = Value;
        this.IsVisible = IsVisible;


    }
}

// Класс ячейки для решения
    export class PuzzleCell {
        public IsFocused = false;
        constructor(public value: string, public index: number, public disabled: boolean) { this.IsFocused = false };
        toString(): string {
            return this.value;
        }

        SetValue(value: number) {
            this.value = '' + value;
            this.disabled = true;

        }
}

// Класс для выбора решения
export class Option {
    constructor(public Name: string, public Index: number) { };
    toString()
    {

        return this.Name + "  index=" + this.Index;
    }
}

 