import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(
    private formbuilder: FormBuilder,
    private service: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}
  pass_type: boolean = false;
  public submitted = false;
  flags: any = [
    {
      name: 'العربية',
      code: 'ar',
      flag: 'assets/images/flags/Search results for Saudi arabia - Flaticon-3.svg',
    },
    {
      name: 'English',
      code: 'en',
      flag: 'assets/images/flags/Search results for English - Flaticon-3.svg',
    },
  ];
  form!: FormGroup;
  lang: any = '';

  ngOnInit(): void {
    this.form = this.formbuilder.group({
      email_or_phone: ['', Validators.required], //534534545
      password: ['', Validators.required], //'12345678m'
    });
    // this.lang=this.flags.filter((flag:any)=>{
    //   return flag.code==localStorage.getItem('lang');
    // })||this.flags;
  }
  get f(): any {
    return this.form.controls;
  }
  submit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    this.spinner.show();
    this.service.login(this.form.value).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status == true) {
          this.toastr.success(res.message, 'success', {
            tapToDismiss: true,
            disableTimeOut: false,
            timeOut: 1000,
            positionClass: 'toast-bottom-right',
          });
          this.router.navigate(['/Dashboard']);
        }
      },
      (err: any) => {
        this.spinner.hide();
        // console.log(err);
        this.toastr.error(err.error.errors[0], 'error', {
          closeButton: true,
          tapToDismiss: true,
          disableTimeOut: false,
          timeOut: 1000,
          positionClass: 'toast-bottom-right',
        });
      }
    );
  }
}
