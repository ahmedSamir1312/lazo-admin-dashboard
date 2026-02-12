import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent implements OnInit {
  form!: FormGroup;
  submitted: boolean = false;
  image: any;
  mobile_image:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditComponent>,
    private formbuilder: FormBuilder,
    private banners: AppService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    console.log(data?.item);
  }

  ngOnInit(): void {
    this.form = this.formbuilder.group({
      title: [this.data?.item.title, Validators.required],
      image: [this.data?.item.image, Validators.required],
      mobile_image: [this.data?.item.mobile_image, Validators.required],
    });
    console.log("datadatadata",this.data)
    this.image = this.data?.item.imagePath;
    this.mobile_image = this.data?.item.mobileImagePath;
  }
  get f(): any {
    return this.form.controls;
  }
  edit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    let form = {
      banner_id: this.data.item.id,
      ...this.form.value,
    };

    this.banners.editbanner(form).subscribe(
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

      this.banners.uploadFiles(event.target.files).subscribe((res: any) => {
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
        }
      });
    } else {
      this.spinner.hide();
      this.toastr.error('Image size must be less than 600 KB', 'Error', {
        tapToDismiss: true,
        disableTimeOut: false,
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
  }

  onMobileBannerChange(event: any) {
    if (event.target.files[0]?.size <= 6000000) {
      if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
       
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();
          
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
          this.mobile_image = 'https://backend-dev.lazo.sa/public/' + res['data'][0];

          console.log(this.mobile_image, 'image url');
          if (res.status == true) {
            this.toastr.success(res.message, 'success', {
              tapToDismiss: true,
              disableTimeOut: false,
              timeOut: 5000,
              positionClass: 'toast-bottom-right',
            });
            this.f.mobile_image.setValue(res.data);
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
