import { Component, Inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../services/app.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-transactions-popup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './transactions-popup.component.html',
  styleUrl: './transactions-popup.component.scss',
})
export class TransactionsPopupComponent {
  environment = environment.files;
  submitted: boolean = false;
  cover_uploded_img: any = [];
  cover_images: any[] = [];
  form!: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,

    public dialogRef: MatDialogRef<TransactionsPopupComponent>,
    private service: AppService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        receipt: [null, Validators.required],
        amount: [null, Validators.required],
      },
      {}
    );
  }
  get f(): any {
    return this.form.controls;
  }
  onProfileCoverChange(event: any) {
    if (event.target.files[0]?.size <= 600000) {
      this.cover_uploded_img = [];
      this.cover_uploded_img.push(event.target.files[0]);
      console.log(this.cover_uploded_img);

      if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();

          reader.onload = (event: any) => {
            this.cover_images = [];

            this.cover_images.push(event.target.result);
          };
          reader.readAsDataURL(event.target.files[i]);
        }
      }
      this.spinner.show();

      this.service.uploadFiles(this.cover_uploded_img).subscribe(
        (res: any) => {
          this.spinner.hide();
          console.log('cover_image', res['data'][0]);
          this.cover_images.push(this.environment + res['data'][0]);

          if (res.status == true) {
            this.toastr.success(res.message, 'success');
            this.form.patchValue({
              receipt: res['data'][0],
            });
          } else {
            this.spinner.hide();
            this.toastr.error(res?.errors[0], 'error');
          }
        },
        (err: any) => {
          this.spinner.hide();
          this.toastr.error(err.error.errors[0], 'error');
        }
      );
    } else {
      this.spinner.hide();
      this.toastr.error('Image size must be less than 600KB', 'error');
    }
  }
  add() {
    console.log(this.form.value);

    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    let form = {
      provider_id: this.data.provider_id,
      ...this.form.value,
    };
    this.service.make_transactions(form).subscribe(
      (res: any) => {
        // console.log("success" ,res)
        if (res.status == true) {
          this.toastr.success(res.message, 'success', {
            tapToDismiss: true,
            disableTimeOut: false,
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
          });
          this.dialogRef.close(true);
        }
      },
      (err: any) => {}
    );
  }
  close() {
    this.dialogRef.close();
  }
}
