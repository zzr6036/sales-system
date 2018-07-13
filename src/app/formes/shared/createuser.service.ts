import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Createuser } from './createuser.model'

@Injectable()
export class CreateuserService {
  selectedCreateuser: Createuser;
  userList: Createuser[];
  constructor(private http : Http) { }

}
