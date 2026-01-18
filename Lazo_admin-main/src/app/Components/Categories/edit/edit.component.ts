import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  form!: FormGroup;
  submitted: boolean = false;
  category: any;
  image: any;

  cover_image: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,

    public dialogRef: MatDialogRef<EditComponent>,
    private formbuilder: FormBuilder,
    private cats: AppService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.category = data?.item;
  }
  ngOnInit(): void {
    this.form = this.formbuilder.group({
      image: [this.category?.image, Validators.required],
      cover_image: [this.category?.cover_image, Validators.required],
      name_en: [this.category?.name_en, Validators.required],
      name_ar: [this.category?.name_ar, Validators.required],
    });
    this.image = this.category?.imagePath;
    this.cover_image = this.category?.coverImagePath;
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
      category_id: this.category.id,
      ...this.form.value,
    };
    this.cats.EditCat(form).subscribe(
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

      this.cats.uploadFiles(event.target.files).subscribe(
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

      this.cats.uploadFiles(event.target.files).subscribe(
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
