import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent implements OnInit {
  form!: FormGroup;
  submitted: boolean = false;
  image: any;
  constructor(
    public dialogRef: MatDialogRef<AddComponent>,
    private formbuilder: FormBuilder,
    private banners: AppService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.form = this.formbuilder.group({
      title: [null, Validators.required],
      image: [null, Validators.required],
    });
  }
  get f(): any {
    return this.form.controls;
  }
  add() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    let form = {
      ...this.form.value,
    };

    this.banners.addbanner(form).subscribe(
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
        } else {
          // this.toastr.error(res.message,'error');
        }
      },
      (err: any) => {
        this.toastr.error(err.error.errors[0], 'error', {
          closeButton: true,
          tapToDismiss: true,
          disableTimeOut: false,
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        });
      }
    );
  }

  close() {
    this.dialogRef.close();
  }
  onBannerChange(event: any) {
    if (event.target.files[0]?.size <= 6000000) {
      if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        // this.toastr.warning('Wait for image to upload', 'Warning', {
        //   tapToDismiss: true,
        //   disableTimeOut: false,
        //   timeOut: 5000,
        //   positionClass: 'toast-bottom-right',
        // });
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();
          // this.imagePath.push(...event.target.files)     imagePath :File[]= [];
          reader.onload = (event: any) => {
            console.log(event.target.result);
          };
          reader.readAsDataURL(event.target.files[i]);
        }
      }

      this.spinner.show();
      this.banners.uploadFiles(event.target.files).subscribe(
        (res: any) => {
          this.spinner.hide();
          this.image = 'https://backend-dev.lazo.sa/public/' + res['data'][0];

          console.log(this.image, 'image url');
          if (res.status == true) {
            this.toastr.success(res.message, 'success', {
              tapToDismiss: true,
              disableTimeOut: false,
              timeOut: 5000,
              positionClass: 'toast-bottom-right',
            });
            this.f.image.setValue(res.data);
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
      this.toastr.error('Image size must be less than 600KB', 'error', {
        tapToDismiss: true,
        disableTimeOut: false,
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
  }
}
