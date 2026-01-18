import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent implements OnInit {
  form!: FormGroup;
  image: any;
  submitted: boolean = false;
  cover_image: any;
  constructor(
    public dialogRef: MatDialogRef<AddComponent>,
    private formbuilder: FormBuilder,
    private admins: AppService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.form = this.formbuilder.group({
      name_en: [null, Validators.required],
      name_ar: [null, Validators.required],
      image: [null, Validators.required],
      cover_image: [null, Validators.required],
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
    this.admins.addCat(form).subscribe(
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
          this.toastr.error(res.message, 'error');
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
  onImageChange(event: any) {
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

      this.admins.uploadFiles(event.target.files).subscribe(
        (res: any) => {
          this.spinner.hide();
          console.log(res['data'][0]);
          this.image = 'https://backend-dev.lazo.sa/public/' + res['data'][0];
          if (res.status == true) {
            this.toastr.success(res.message, 'success', {
              tapToDismiss: true,
              disableTimeOut: false,
              timeOut: 5000,
              positionClass: 'toast-bottom-right',
            });
            this.f.image.setValue(res.data);
          } else {
            // this.toastr.error(res?.errors[0],'error');
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
  onCoverChange(event: any) {
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

      this.admins.uploadFiles(event.target.files).subscribe(
        (res: any) => {
          this.spinner.hide();
          console.log(res['data'][0]);
          this.cover_image =
            'https://backend-dev.lazo.sa/public/' + res['data'][0];
          if (res.status == true) {
            this.toastr.success(res.message, 'success', {
              tapToDismiss: true,
              disableTimeOut: false,
              timeOut: 5000,
              positionClass: 'toast-bottom-right',
            });
            this.f.cover_image.setValue(res.data);
          } else {
            // this.toastr.error(res?.errors[0],'error');
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
}
