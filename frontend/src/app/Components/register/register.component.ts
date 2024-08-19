import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ErrorsStateMatcher } from 'src/app/Error-state-matcher';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  errorMessage: string = '';
  constructor(
    private userService: UserService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  // Declaration
  isSubmited: boolean = false;
  hide: boolean = true;

  // Form group
  form: FormGroup = new FormGroup(
    {
      role: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}'),
      ]),
      cPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: this.passwordMatch('password', 'cPassword'),
    }
  );

  // Get all Form Fields
  get role() {
    return this.form.get('role');
  }
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
  get cPassword() {
    return this.form.get('cPassword');
  }

  // Match errors in the submission of form
  matcher = new ErrorsStateMatcher();

  // Submit function
  onSubmit() {
    this.isSubmited = true;
    if (!this.form.invalid) {
      const user = {
        email: this.email?.value,
        password: this.password?.value,
        role: this.role?.value,
      };
      this.userService.Create(user).subscribe({
        next: (res:any) => {
        this._snackBar.open('Your account has been created successfully', '✔️');
        setTimeout(() => (window.location.href = '/signin'), 2000);
        this.errorMessage = "";
        },
        error: (err) => {
          console.log('error', err.error.error);
          this.errorMessage = err.error.error;
          this._snackBar.open(this.errorMessage, '❌');
        }
      });
    } else {
      console.log(this.form);
      this._snackBar.open('Enter valid information!', '❌');
    }
  }

  // Check if password and confirm password are matched
  passwordMatch(password: string, confirmPassword: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }
}
