import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRegister, IResponse } from '../shared/models/register';
import { Observable, ReplaySubject, map, of } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ILogin } from '../shared/models/login';
import { IUser } from '../shared/models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient,
    private router: Router

  ) { }

  private userSource = new ReplaySubject<IUser | null>(1);
  user$ = this.userSource.asObservable();

  login(model: ILogin): Observable<IUser | unknown> {
    return this.http.post<IUser>(`${environment.appUrl}/api/account/login`, model)
      .pipe(
        map((user: unknown) => {
          if (user) {
            this.setUser(user as IUser);
            return user as IUser;
          }
          return null;
        })
      );
  }

  logout(): void {
    localStorage.removeItem(environment.userKey);
    this.userSource.next(null);
    this.router.navigateByUrl('/account/login');
  }

  register(model: IRegister): Observable<IResponse> {
    return this.http.post<IResponse>(`${environment.appUrl}/api/account/register`, model);
  }

  getJWT(): string | null{
    const key = localStorage.getItem(environment.userKey);
    if (key) {
      const user: IUser = JSON.parse(key);
      return user.jwt;
    } else {
      return null;
    }
  }

  private setUser(user: IUser) {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.userSource.next(user);
  }

  refreshUser(jwt: string | null): Observable< undefined | IUser> {
    if (jwt === null) {
      this.userSource.next(null);
      return of(undefined);
    }

    let headers = new HttpHeaders()
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this.http.get<IUser>(`${environment.appUrl}/api/account/refresh-user-token`, { headers })
      .pipe(
        map((user: IUser) => {
          if (user) {
            this.setUser(user);
            return user;
          }
          return undefined;
        })
    );
  }


}
