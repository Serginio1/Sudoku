"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_service_1 = require("./http.service");
var Model_1 = require("./Model");
var SudokuComponent = (function () {
    function SudokuComponent(httpService) {
        this.httpService = httpService;
        this.RowsRange = new Array(9);
        this.ColsRange = this.RowsRange;
        this.done = false;
        this.defaultStr = "Выберите вариант";
        this.IsSelectedOption = false;
    }
    // Загрузим варианты
    SudokuComponent.prototype.ngOnInit = function () {
        //Алгоритм заполнения взят отсюда
        //https://github.com/perry-mitchell/sudoku-generator-cs
        var _this = this;
        // Загружаем данные из статического файла
        // И устанавливаем нужные флаги
        this.httpService.getSudokuArray().subscribe(function (data) {
            _this.SudokuArray = data;
            _this.CurrentOptionStr = _this.defaultStr;
            _this.done = true;
            _this.Options = [new Model_1.Option(_this.defaultStr, -1)];
            _this.FillOptions();
        });
    };
    SudokuComponent.prototype.FillOptions = function () {
        this.Options = [new Model_1.Option(this.defaultStr, -1)];
        for (var i = 0; i < this.SudokuArray.length; i++) {
            this.Options.push(new Model_1.Option("Вариант " + (i + 1), i));
        }
    };
    // Запоняем квадрат для решения, по выбранному варианту
    SudokuComponent.prototype.FillPuzzle = function () {
        var Puzzle = [];
        for (var i = 0; i < 81; i++) {
            //  this.users.push(new User2("", i, false));
            var Cell = this.CurrentSudoku[i];
            var value = Cell.IsVisible ? '' + Cell.Value : '';
            var puzzleCell = new Model_1.PuzzleCell(value, i, Cell.IsVisible);
            Puzzle.push(puzzleCell);
        }
        this.Puzzle = Puzzle;
    };
    // Отслеживаем нажатие только цифр
    // Если нажата не цифра или ячейка уже имеет значение то пропускаем
    // Можно заменять текущее значение на нажатое
    SudokuComponent.prototype.KeyPress = function (event, name) {
        var pattern = '123456789';
        var inputChar = String.fromCharCode(event.charCode);
        if (name.length > 0 || pattern.indexOf(inputChar) == -1) {
            // invalid character, prevent input
            event.preventDefault();
        }
    };
    // Отслеживаем клик по ячейке для установки текущей ячейки
    SudokuComponent.prototype.Click = function (item) {
        if (item != this.CurrentPuzzleCell) {
            if (this.CurrentPuzzleCell != undefined)
                this.CurrentPuzzleCell.IsFocused = false;
            item.IsFocused = true;
            this.CurrentPuzzleCell = item;
        }
    };
    // Сапускаем выбранный вариант
    // Заполняем таблицы для решения и полный вариант решения
    SudokuComponent.prototype.PlayGame = function () {
        var _this = this;
        if (this.CurrentOptionStr == this.defaultStr) {
            this.IsSelectedOption = false;
            return;
        }
        var idx = this.Options.findIndex(function (cur) {
            return cur.Name == _this.CurrentOptionStr;
        });
        var CurrentOption = this.Options[idx];
        var index = CurrentOption.Index;
        this.CurrentSudoku = this.SudokuArray[index];
        this.FillPuzzle();
        this.Options.splice(idx, 1);
        if (this.Options.length == 1)
            this.FillOptions();
        this.CurrentOptionStr = this.defaultStr;
        this.IsSelectedOption = true;
        this.CurrentPuzzleCell = undefined;
    };
    SudokuComponent.prototype.onSelectedObjChanged = function () {
    };
    // Проверяем значение ячейки с уже заполненными
    //Если значения нет то добавляем текущее значение строке
    //содержащщей значения ячеек
    SudokuComponent.prototype.CheckValue = function (address, str) {
        try {
            var value = this.Puzzle[address].value;
            if (str.indexOf(value) > -1)
                return undefined;
            str += value;
        }
        catch (e) {
            alert("ошибка " + e);
        }
        return str;
    };
    // Проверяем на дубли колонку
    SudokuComponent.prototype.CheckCol = function (index) {
        var address = index;
        var str = this.Puzzle[address].value;
        for (var i = 1; i < 9; i++) {
            address += 9;
            str = this.CheckValue(address, str);
            if (str == undefined)
                return false;
        }
        return true;
    };
    // Проверяем на дубли строку
    SudokuComponent.prototype.CheckRow = function (index) {
        var address = index * 9;
        var str = this.Puzzle[address].value;
        for (var i = 1; i < 9; i++) {
            address++;
            str = this.CheckValue(address, str);
            if (str == undefined)
                return false;
        }
        return true;
    };
    // Проверяем на дубли квадраты
    SudokuComponent.prototype.CheckSquare = function (address) {
        var str = "";
        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++) {
                var address1 = address + 9 * i + j;
                str = this.CheckValue(address1, str);
                if (str == undefined)
                    return false;
            }
        return true;
    };
    // Проверяем заполнение ячеек значениями
    SudokuComponent.prototype.CheckFillCell = function () {
        for (var i = 0; i < 81; i++) {
            var cell = this.Puzzle[i];
            if (cell.value == "") {
                return false;
            }
        }
        return true;
    };
    // Проверяем правильность заполнения 
    SudokuComponent.prototype.ChecPuzle = function () {
        var MessageError = "В решении есть ошибки";
        if (!this.CheckFillCell()) {
            alert("Не все ячейки заполнены");
            return;
        }
        for (var i = 0; i < 9; i++)
            if (!(this.CheckCol(i) && this.CheckRow(i))) {
                alert(MessageError);
                return;
            }
        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++) {
                var address = i * 27 + j * 3;
                if (!this.CheckSquare(address)) {
                    alert(MessageError);
                    return;
                }
            }
        alert("Поздравляю Вас! Вы правильно решили Судоку");
    };
    SudokuComponent.prototype.OpenCell = function () {
        if (this.CurrentPuzzleCell != undefined) {
            this.CurrentPuzzleCell.value = "" + this.CurrentSudoku[this.CurrentPuzzleCell.index].Value;
        }
    };
    SudokuComponent.prototype.SetPuzleCell = function () {
        for (var i = 0; i < 81; i++) {
            var cell = this.Puzzle[i];
            if (cell.value == "") {
                cell.value = "" + this.CurrentSudoku[cell.index].Value;
            }
        }
    };
    return SudokuComponent;
}());
SudokuComponent = __decorate([
    core_1.Component({
        selector: 'sudoku',
        template: "\n<div class=\"container\" *ngIf=\"done\">\n    <p>\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u0437\u0430\u0434\u0430\u043D\u0438\u044F</p>\n    <select class=\"form-control\" required [(ngModel)]=\"CurrentOptionStr\" (ngModelChange)=\"onSelectedObjChanged($event)\">\n        <option *ngFor=\" let option of Options\"\n                [value]=\"option.Name\">\n            {{option.Name}}\n        </option>\n    </select>\n    <button (click)=\"PlayGame()\">\u0418\u0433\u0440\u0430\u0442\u044C!</button>\n    <div *ngIf=\"IsSelectedOption\">\n        <div class=\"row\">\n            <div class=\"col-6\">\n                <table>\n                    <tbody>\n                        <tr *ngFor=\"let rows of RowsRange; let row = index\">\n                            <td *ngFor=\"let col of ColsRange; let i = index\">\n                                <input type=\"text\" (keypress)=\"KeyPress($event,Puzzle[row*9+i].value)\" (click)=\"Click(Puzzle[row*9+i])\" [class.IsFocused]=\"Puzzle[row*9+i].IsFocused\"\n                                       [(ngModel)]=\"Puzzle[row*9+i].value\" [disabled]=\"Puzzle[row*9+i].disabled\" size=\"3\" maxlength=\"1\">\n                            </td>\n                        </tr>\n\n                    </tbody>\n                </table>\n                <h1></h1>\n                <div class=\"btn-group\">\n                    <button class=\"btn\" (click)=\"OpenCell()\">\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u044F\u0447\u0435\u0439\u043A\u0443!</button>\n                    <button class=\"btn\" (click)=\"SetPuzleCell()\"> \u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u044C </button>\n                    <button class=\"btn\" (click)=\"ChecPuzle()\"> \u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 </button>\n                </div>\n            </div>\n           \n           <div class=\"col-1\">\n           </div>\n            <div class=\"col-5\">\n\n                <table class=\"table table-striped table-bordered table-condensed\">\n                    <tr *ngFor=\"let rows of RowsRange; let row = index\">\n                        <td  *ngFor=\"let col of ColsRange; let i = index\">\n                            {{CurrentSudoku[row*9+i].Value}}\n                        </td>\n                    </tr>\n                </table>\n            </div>\n        </div>\n    </div>\n</div>\n",
        styles: [" \n           input.IsFocused {background-color:#D0FA58;}\n           input,td {text-align: center;}\n           select {width: 300px;}\n\n\u00A0\u00A0\u00A0\u00A0"],
        providers: [http_service_1.HttpService]
    }),
    __metadata("design:paramtypes", [http_service_1.HttpService])
], SudokuComponent);
exports.SudokuComponent = SudokuComponent;
//# sourceMappingURL=Sudoku.component.js.map