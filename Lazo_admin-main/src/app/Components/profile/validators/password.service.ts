import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class PasswordValidatorService {
  static match(control: AbstractControl): ValidationErrors | null {
    const password = control.get('new_password')?.value;
    const confirm = control.get('confirm_new_password')?.value;

    return password === confirm ? null : { passwordMismatch: true };
  }
}
