import { Component, Inject, inject, OnInit } from '@angular/core';
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
import { finalize } from 'rxjs';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [
    NgSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    NgxMaterialTimepickerModule,
  ],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
})
export class UpdateComponent {
  form!: FormGroup;
  submitted: boolean = false;
  item: any;
  constructor(
    private formbuilder: FormBuilder,
    private service: AppService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<UpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.item = this.data?.item;
    console.log(this.item);
    if (this.data?.type == 'Time') {
      this.form = this.formbuilder.group({
        from: [this.item?.from, Validators.required],
        to: [this.item?.to, Validators.required],
        is_current_day_included: [
          this.item?.is_current_day_included,
          Validators.required,
        ],
      });
    } else {
      this.form = this.formbuilder.group({
        amount: [this.item?.amount, Validators.required],
      });
    }
  }
  get f(): any {
    return this.form.controls;
  }
  update() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.spinner.show();
    if (this.data?.type == 'Time') {
      this.service
        .updateDelevery(this.item?.id, this.form.value)
        .pipe(finalize(() => this.spinner.hide()))
        .subscribe(
          (res: any) => {
            this.dialogRef.close(res);
          },
          (err: any) => {
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
      this.service
        .EditDeliveryFees(this.data?.item?.id, this.form.value)
        .subscribe(
          (res: any) => {
            this.spinner.hide();
            this.dialogRef.close(res);
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
  close() {
    this.dialogRef.close();
  }
  timeValueChange(type: 'from' | 'to', selectedTime: any) {
    console.log(selectedTime);
    this.form.get(type)?.setValue(selectedTime);
  }
  dateValueChange(controlName: 'from' | 'to', event: any) {
    this.form.controls[controlName].setValue(event?.value);
  }
}
