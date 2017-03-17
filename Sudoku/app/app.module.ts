import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { SudokuComponent } from "./Sudoku.component";
import { HttpModule } from '@angular/http';
@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule],
    declarations: [SudokuComponent],
    bootstrap: [SudokuComponent]
})
 export class AppModule { }