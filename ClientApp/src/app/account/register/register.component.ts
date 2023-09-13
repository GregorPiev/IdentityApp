import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared/shared.service';
import { IResponse } from '../../shared/models/register';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { IUser } from '../../shared/models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];
  registerSubscription!: Subscription;
  returnUrl: string | null = null;

  constructor(
    private acountService: AccountService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.acountService.user$.pipe(take(1))
      .subscribe({
        next: (user: IUser | null) => {
          if (user) {
            this.router.navigateByUrl('/');
          }
        }
      });
  }

  ngOnInit(): void {
    this.initilizeForm();
  }

  initilizeForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    });
  }

  register(): void {
    this.submitted = true;
    this.errorMessages = [];

    this.registerSubscription = this.acountService.register(this.registerForm.value)
        .subscribe({
          next: (response: IResponse) => {            
            this.sharedService.showNotification(true, response.value.title, response.value.message);
            this.router.navigateByUrl('/account/login');
          },
          error: (error) => {           
            if (error.error.errors) {
              this.errorMessages = error.error.errors;
            } else {
              this.errorMessages = [error.error];
            }          
          }
        });
    
  }

  ngOnDestroy(): void {
    this.registerSubscription.unsubscribe();
  }

}
