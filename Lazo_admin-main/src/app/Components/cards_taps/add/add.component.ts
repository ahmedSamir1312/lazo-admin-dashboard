import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent implements OnInit {
  type: any;
  form!: FormGroup;
  submitted: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,

    public dialogRef: MatDialogRef<AddComponent>,
    private formbuilder: FormBuilder,
    private cats: AppService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.type = data?.type;
  }
  ngOnInit(): void {
    this.form = this.formbuilder.group({
      name_en: [null, Validators.required],
      name_ar: [null, Validators.required],
      price: [null],
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
    if (this.type == 'Card') {
      this.cats.addcard(form).subscribe(
        (res: any) => {
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
    if (this.type == 'Tap') {
      this.cats.addtap(form).subscribe(
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
  }

  close() {
    this.dialogRef.close();
  }
  onTermsChange(event: any) {
    if (event.target.files[0]?.size <= 6000000) {
      if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
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
          // console.log(res['data'][0])
          this.spinner.hide();
          if (res.status == true) {
            this.f.image.setValue(res.data);
          } else {
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
}
