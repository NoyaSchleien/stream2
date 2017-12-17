import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class AppService {

  private _stream:any;
  // private _blob:XMLHttpRequestResponseType="blob";
  private _url = 'http://localhost:58949/api/Test/get';
  
  constructor(private _http: HttpClient) { }

  getStream(): any{
    return this._http.get(this._url,{
      headers:new HttpHeaders().set('accept','Byte[]'),
      responseType: "blob"
    })
    .do(data=> this._stream = data)
    .catch(this.handleError);
  }
  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }
}
