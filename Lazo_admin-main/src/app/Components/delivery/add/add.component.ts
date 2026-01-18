import { Component, inject, OnInit } from '@angular/core';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import moment from 'moment';
import { MatInputModule } from '@angular/material/input';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    NgSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    NgxMaterialTimepickerModule,
    MatSlideToggleModule,
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent {
  form!: FormGroup;
  submitted: boolean = false;
  readonly data = inject<any>(MAT_DIALOG_DATA);

  constructor(
    public dialogRef: MatDialogRef<AddComponent>,
    private formbuilder: FormBuilder,
    private service: AppService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    console.log(this.data);
    if (this.data?.type == 'Time') {
      this.form = this.formbuilder.group({
        from: [null, Validators.required],
        to: [null, [Validators.required]],
        is_current_day_included: [false, Validators.required],
      });
    } else {
      this.form = this.formbuilder.group({
        amount: [null, Validators.required],
      });
    }
  }
  get f(): any {
    return this.form.controls;
  }
  add() {
    this.submitted = true;
    console.log(this.form.value);
    if (this.form.invalid) {
      return;
    }
    this.spinner.show();
    if (this.data?.type == 'Time') {
      this.service.addDelevery(this.form.value).subscribe(
        (res: any) => {
          this.spinner.hide();
          this.dialogRef.close(res?.message);
        },
        (err: any) => {
          this.spinner.hide();
          this.toastr.error(err?.error?.errors[0], 'error', {
            closeButton: true,
            tapToDismiss: true,
            disableTimeOut: false,
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
          });
        }
      );
    } else {
      this.service.addDeliveryFees(this.form.value).subscribe(
        (res: any) => {
          this.spinner.hide();
          this.dialogRef.close(res?.message);
        },
        (err: any) => {
          this.spinner.hide();
          this.toastr.error(err?.error?.errors[0], 'error', {
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
  timeValueChange(type: 'from' | 'to', selectedTime: any) {
    console.log(selectedTime);
    this.form.get(type)?.setValue(selectedTime);
  }
  close() {
    this.dialogRef.close();
  }
}
