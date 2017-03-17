"use strict";
// Класс с исходным решением и значениями открытых ячеек
var SudokuCell = (function () {
    function SudokuCell(Value, IsVisible) {
        this.Value = Value;
        this.IsVisible = IsVisible;
    }
    return SudokuCell;
}());
exports.SudokuCell = SudokuCell;
// Класс ячейки для решения
var PuzzleCell = (function () {
    function PuzzleCell(value, index, disabled) {
        this.value = value;
        this.index = index;
        this.disabled = disabled;
        this.IsFocused = false;
        this.IsFocused = false;
    }
    ;
    PuzzleCell.prototype.toString = function () {
        return this.value;
    };
    PuzzleCell.prototype.SetValue = function (value) {
        this.value = '' + value;
        this.disabled = true;
    };
    return PuzzleCell;
}());
exports.PuzzleCell = PuzzleCell;
// Класс для выбора решения
var Option = (function () {
    function Option(Name, Index) {
        this.Name = Name;
        this.Index = Index;
    }
    ;
    Option.prototype.toString = function () {
        return this.Name + "  index=" + this.Index;
    };
    return Option;
}());
exports.Option = Option;
//# sourceMappingURL=Model.js.map