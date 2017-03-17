import { Component, OnInit } from '@angular/core';
import { HttpService } from './http.service';
import { SudokuCell, PuzzleCell, Option } from './Model';
import { NgForm } from '@angular/forms';


@Component({
    selector: 'sudoku',
    template: `
<div class="container" *ngIf="done">
    <p>Выберите вариант задания</p>
    <select class="form-control" required [(ngModel)]="CurrentOptionStr" (ngModelChange)="onSelectedObjChanged($event)">
        <option *ngFor=" let option of Options"
                [value]="option.Name">
            {{option.Name}}
        </option>
    </select>
    <button (click)="PlayGame()">Играть!</button>
    <div *ngIf="IsSelectedOption">
        <div class="row">
            <div class="col-6">
                <table>
                    <tbody>
                        <tr *ngFor="let rows of RowsRange; let row = index">
                            <td *ngFor="let col of ColsRange; let i = index">
                                <input type="text" (keypress)="KeyPress($event,Puzzle[row*9+i].value)" (click)="Click(Puzzle[row*9+i])" [class.IsFocused]="Puzzle[row*9+i].IsFocused"
                                       [(ngModel)]="Puzzle[row*9+i].value" [disabled]="Puzzle[row*9+i].disabled" size="3" maxlength="1">
                            </td>
                        </tr>

                    </tbody>
                </table>
                <h1></h1>
                <div class="btn-group">
                    <button class="btn" (click)="OpenCell()">Открыть ячейку!</button>
                    <button class="btn" (click)="SetPuzleCell()"> Заполнить </button>
                    <button class="btn" (click)="ChecPuzle()"> Проверить заполнение </button>
                </div>
            </div>
           
           <div class="col-1">
           </div>
            <div class="col-5">

                <table class="table table-striped table-bordered table-condensed">
                    <tr *ngFor="let rows of RowsRange; let row = index">
                        <td width="3" *ngFor="let col of ColsRange; let i = index">
                            {{CurrentSudoku[row*9+i].Value}}
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>
`,
    styles: [` 
            container {width: 1200px;}
            input.IsFocused {background-color:#D0FA58;}
           input,td {text-align: center}
select {
    width: 300px; /* Ширина списка в пикселах */
   }

    `],
    providers: [HttpService]
})
export class SudokuComponent {


    RowsRange = new Array(9);
    ColsRange = this.RowsRange;

    SudokuArray: SudokuCell[][];
    Puzzle: PuzzleCell[];
    CurrentSudoku: SudokuCell[];
    CurrentPuzzleCell: PuzzleCell;
    done: boolean = false;
    Options: Option[];
    CurrentOptionStr: string;

    defaultStr = "Выберите вариант";
    IsSelectedOption=false;

    constructor(private httpService: HttpService) { }

    // Загрузим варианты
    ngOnInit()
     {
        //Алгоритм заполнения взят отсюда
        //https://github.com/perry-mitchell/sudoku-generator-cs

        this.httpService.getSudokuArray().subscribe((data) => {
            this.SudokuArray = data;
         
            this.CurrentOptionStr = this.defaultStr;

            this.done = true;
            this.Options = [new Option(this.defaultStr, -1)];
            this.FillOptions();
        });
    }
    FillOptions()
    {
        this.Options = [new Option(this.defaultStr, -1)];
        for (let i = 0; i < this.SudokuArray.length; i++) {
            this.Options.push(new Option("Вариант " + (i + 1), i));

        }

    }

    // Запоняем квадрат для решения, по выбранному варианту
    FillPuzzle() {
        let Puzzle: PuzzleCell[] = [];

       
        for (let i = 0; i < 81; i++) {
            //  this.users.push(new User2("", i, false));

            let Cell = this.CurrentSudoku[i];
            let value: string = Cell.IsVisible ? '' + Cell.Value : '';

            let puzzleCell = new PuzzleCell(value, i, Cell.IsVisible);
            Puzzle.push(puzzleCell);


        }

        this.Puzzle = Puzzle;

    }


    // Отслеживаем нажатие только цифр
    // Если нажата не цифра или ячейка уже имеет значение то пропускаем
    // Можно заменять текущее значение на нажатое
    KeyPress(event: any, name: string) {

        const pattern = '123456789';
        let inputChar = String.fromCharCode(event.charCode);
                
        if (name.length > 0 || pattern.indexOf(inputChar) == -1) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    // Отслеживаем клик по ячейке для установки текущей ячейки
    Click(item: PuzzleCell) {


        if (item != this.CurrentPuzzleCell) {
            if (this.CurrentPuzzleCell != undefined)
                this.CurrentPuzzleCell.IsFocused = false;

            item.IsFocused = true;
            this.CurrentPuzzleCell = item;

        }

    }

    // Сапускаем выбранный вариант
    // Заполняем таблицы для решения и полный вариант решения
    PlayGame()
    {

       

        if (this.CurrentOptionStr == this.defaultStr) {
            this.IsSelectedOption = false;
            return;
        }

        let idx = this.Options.findIndex((cur: Option) => {
            return cur.Name == this.CurrentOptionStr;
        });

        let CurrentOption = this.Options[idx];


        let index = CurrentOption.Index;

        this.CurrentSudoku = this.SudokuArray[index];
        this.FillPuzzle();

        this.Options.splice(idx, 1);


        if (this.Options.length == 1)
            this.FillOptions();

        this.CurrentOptionStr = this.defaultStr;

        this.IsSelectedOption = true;
        this.CurrentPuzzleCell = undefined;
       

    }
    onSelectedObjChanged()
    {
        
     
      
        
    }

    // Проверяем значение ячейки с уже заполненными
    //Если значения нет то добавляем текущее значение строке
    //содержащщей значения ячеек
    CheckValue(address: number, str:string)
    {
        try {
        let value = this.Puzzle[address].value;
        if (str.indexOf(value) > -1)
            return undefined;

        str += value;

    }
    catch(e) {
        alert("ошибка " + e);
    }

        return str;
    }

    // Проверяем на дубли колонку
    CheckCol(index: number): boolean
    {
       let address = index;
       
       let str = this.Puzzle[address].value;

       

       for (let i = 1; i < 9; i++)
       {
           address += 9;
           str = this.CheckValue(address, str);

           if (str == undefined)
               return false;
       }
        
       return true;
    }

    // Проверяем на дубли строку
    CheckRow(index: number): boolean {
        let address = index * 9;
        let str = this.Puzzle[address].value;

        for (let i = 1; i < 9; i++) {
            address++;
            str = this.CheckValue(address, str);

            if (str == undefined)
                return false;
        }

        
        return true;
    }

    // Проверяем на дубли квадраты
    CheckSquare(address: number): boolean
    {
        let str = "";
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
            {
                let address1 = address + 9 * i + j;
                str = this.CheckValue(address1, str);

                if (str == undefined)
                    return false;

            }
        return true;
    }

    // Проверяем заполнение ячеек значениями
    CheckFillCell(): boolean
    {
        for (let i = 0; i < 81; i++) {
            let cell = this.Puzzle[i];
            if (cell.value == "") {
                return false;

            }

        }

        return true;

    }

    // Проверяем правильность заполнения 
    ChecPuzle()
    {

        let MessageError = "В решении есть ошибки";
        if (!this.CheckFillCell())
        {
            alert("Не все ячейки заполнены");
            return;

        }
        for (let i = 0; i < 9; i++)

            if (!(this.CheckCol(i) && this.CheckRow(i)))
            {
                alert(MessageError);
                return;

            }

        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++) {

                let address = i * 27 + j * 3;

                if (!this.CheckSquare(address))
                {
                    alert(MessageError);
                    return;
                }
            }

        alert("Поздравляю Вас! Вы правильно решили Судоку");

    }
    OpenCell()
    {
        if (this.CurrentPuzzleCell != undefined)
        {
            this.CurrentPuzzleCell.value = ""+this.CurrentSudoku[this.CurrentPuzzleCell.index].Value;

        }

    }

    SetPuzleCell()
    {
        for (let i = 0; i < 81; i++)
        {
            let cell = this.Puzzle[i];
            if (cell.value == "")
            {
                cell.value = ""+this.CurrentSudoku[cell.index].Value

            }

        }

    }
}