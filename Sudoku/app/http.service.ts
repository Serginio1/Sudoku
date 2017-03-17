import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Response, Headers, URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class HttpService {

    constructor(private http: Http) { }

   


    getSudokuArray()
    {
        return this.http.get('/StaticFiles/SudokuCells.html')
            .map((resp: Response) => {
               return resp.json();
            });
    }

    
}