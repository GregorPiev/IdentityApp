import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IRegister } from '../../shared/models/register';

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

  constructor(
    private acountService: AccountService,
    private formBuilder: FormBuilder,    
    private router: Router
  ) { }

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
          // this.router.navigateByUrl('/account/login');
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
    this.loginSubscription.unsubscribe();
  }

}
