import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../../account/account.service';
import { SharedService } from '../shared.service';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard {

  constructor(
    private accountService: AccountService,
    private sharedService: SharedService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    return this.accountService.user$.pipe(
      map((user: IUser | null) => {
        if (user) {
          return true;
        } else {
          this.sharedService.showNotification(false, 'Restricted Area', 'Leave Immediatly');
          this.router.navigate(['account/login'], { queryParams: { returnUrl: state.url } })
          return false;
        }
      })
    );
  }
}
