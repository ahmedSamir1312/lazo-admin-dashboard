import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { count } from 'rxjs';
import { MapComponent } from '../../Service_Providers/map/map.component';
import { largepopup } from '../../../Shared/configration';
@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent implements OnInit {
  form!: FormGroup;
  submitted: boolean = false;
  Countries: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddComponent>,
    private formbuilder: FormBuilder,
    private admins: AppService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.Countries = data.Countries;
    console.log(this.Countries);
  }
  ngOnInit(): void {
    this.form = this.formbuilder.group({
      name_en: [null, Validators.required],
      name_ar: [null, Validators.required],
      country_id: [null, Validators.required],
      lat: [null, Validators.required],
      lng: [null, Validators.required],
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
    this.admins.addCity(form).subscribe(
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

  openMap(enterAnimationDuration: string, exitAnimationDuration: string) {
    var dialogRef = this.dialog.open(MapComponent, {
      ...largepopup,
      enterAnimationDuration,
      exitAnimationDuration,
      data: { title: 'Pick Location', data: {} },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result, 'Pick Location');

        this.form.patchValue({
          lat: result?.lat,
          lng: result?.long,
        });
      }
    });
  }
}
