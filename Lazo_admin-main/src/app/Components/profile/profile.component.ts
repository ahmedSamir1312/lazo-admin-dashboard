import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { PasswordValidatorService } from './validators/password.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  submitted: boolean = false;
  user: any;
  local: any = localStorage.getItem('permissions');
  roles: any = '';
  changePasswordMode: boolean = false;
  constructor(
    private userInfo: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {
    this.userInfo.currentUser.subscribe((user: any) => {
      console.log(user);
      this.user = user?.data.admin;
      if (this.user?.permissions.length > 0) {
        this.roles = this.user.permissions;
      } else {
        this.roles = JSON.parse(this.local);
      }
    });
  }
  ngOnInit(): void {
    this.initializeForm();
  }
  get f(): any {
    return this.form.controls;
  }
  initializeForm() {
    this.form = this.fb.group(
      {
        old_password: ['', [Validators.required]],
        new_password: ['', [Validators.required, Validators.minLength(8)]],
        confirm_new_password: [
          '',
          [Validators.required, Validators.minLength(8)],
        ],
      },
      { validators: PasswordValidatorService.match }
    );
  }
  ChangePassword() {
    this.changePasswordMode = !this.changePasswordMode;
  }
  SubmitNewPassword() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.spinner.show();
    this.userInfo.changePassword(this.form.value).subscribe(
      (res: any) => {
        this.spinner.hide();
        this.ChangePassword();
        this.toaster.success(res.message, 'Success', {
          tapToDismiss: true,
          disableTimeOut: false,
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        });
        this.submitted = false;
        this.form.reset();
      },
      (err: any) => {
        this.spinner.hide();
        this.toaster.error(err.error.message, 'Error', {
          tapToDismiss: true,
          disableTimeOut: false,
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        });
      }
    );
  }
}
