import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRegister, IResponse } from '../shared/models/register';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ILogin } from '../shared/models/login';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  register(model: IRegister): Observable<IResponse> {
    return this.http.post<IResponse>(`${environment.appUrl}/api/account/register`, model);
  }

  login(model: ILogin) {
    return this.http.post(`${environment.appUrl}/api/account/login`, model);
  }
}
