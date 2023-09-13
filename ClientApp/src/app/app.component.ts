import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private acountService: AccountService
  ) { }

  ngOnInit(): void {
    this.refreshUser();
  }

  private refreshUser() {
    const jwt = this.acountService.getJWT();
    if (jwt) {
      this.acountService.refreshUser(jwt)
        .subscribe({
          next: _ => { },
          error: _ => {
            this.acountService.logout();
          }
        })
    } else {
      this.acountService.refreshUser(null).subscribe();
    }
  }
}
