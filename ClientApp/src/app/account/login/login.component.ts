import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { IRegister } from '../../shared/models/register';
import { IUser } from '../../shared/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];
  loginSubscription!: Subscription;
  returnUrl: string | null = null;

  constructor(
    private acountService: AccountService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    this.acountService.user$.pipe(take(1))
      .subscribe({
        next: (user: IUser | null) => {
          if (user) {
            this.router.navigateByUrl('/');
          } else {
            this.activatedRoute.queryParamMap.subscribe({
              next: (params: any) => {
                if (params) {
                  this.returnUrl = params.get('returnUrl');
                }
              }
            })
          }
        }
      });
  }

  ngOnInit(): void {
    this.initilizeForm();
  }

  initilizeForm(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    this.submitted = true;
    this.errorMessages = [];

    this.loginSubscription = this.acountService.login(this.loginForm.value)
      .subscribe({
        next: (response) => {
          console.log(response);
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigateByUrl('/');
          }
        },
        error: (error: any) => {
          console.log(error)
          if (error.error.errors) {
            this.errorMessages = error.error.errors;
          } else {
            this.errorMessages = [error.error];
          }
        }
      });

  }

  ngOnDestroy(): void {
    if (this.loginSubscription) this.loginSubscription.unsubscribe();
  }

}
