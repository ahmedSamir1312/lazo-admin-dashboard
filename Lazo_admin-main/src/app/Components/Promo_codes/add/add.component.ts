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
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import moment from 'moment';
import { MatInputModule } from '@angular/material/input';
import { NgSelectModule } from '@ng-select/ng-select';
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
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent implements OnInit {
  form!: FormGroup;
  submitted: boolean = false;
  types: any = [
    { name: 'Money Amount', value: 'amount' },
    { name: 'Percent ', value: 'percent' },
  ];
  selectedRolesIds: any;
  constructor(
    public dialogRef: MatDialogRef<AddComponent>,
    private formbuilder: FormBuilder,
    private admins: AppService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.form = this.formbuilder.group({
      code: [null, Validators.required],
      value: [null, [Validators.required]],
      expiration_date: [null, Validators.required],
      allowed_usage_number: [
        null,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
    });
  }
  get f(): any {
    return this.form.controls;
  }
  add() {
    this.submitted = true;

    if (this.form.invalid || !this.selectedRolesIds) {
      return;
    }
    let form = {
      ...this.form.value,
      type: this.selectedRolesIds,
    };
    console.log(form);

    this.admins.addCode(form).subscribe(
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
      (err: any) => {
        //   this.toastr.error(err.error.errors[0],'error',{closeButton: true,
        //     tapToDismiss:true,
        // disableTimeOut:false,
        // timeOut: 5000,
        // positionClass: 'toast-bottom-right',})
      }
    );
  }

  close() {
    this.dialogRef.close();
  }
  dateValueChange(event: any) {
    console.log(event.value);

    this.form.controls['expiration_date'].setValue(
      moment(event.value).format('YYYY-MM-DD')
    );
  }
}
