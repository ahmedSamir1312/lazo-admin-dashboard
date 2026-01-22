import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FormsModule , ReactiveFormsModule , CommonModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {
submitted: boolean = false;
form!: FormGroup;
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddComponent> , private formbuilder:FormBuilder , private clint:AppService , private toastr :ToastrService){
    console.log(data.item);
  }

  ngOnInit(): void {
    this.form = this.formbuilder.group({
      type:['provider' ,Validators.required],
      contact_email:[this.data.item.contact_email,[Validators.required , Validators.email]] ,
      contact_phone:[ this.data.item.contact_phone ,[Validators.required ,  Validators.minLength(11)]] ,
      contact_whatsapp:[this.data.item.contact_whatsapp ,[Validators.required , Validators.minLength(11)]] ,
    })
  }

  get f():any{
    return this.form.controls
  }

  add() {

    this.submitted = true;

    if(this.form.invalid){ 
      return;
    }
    
    this.clint.setfile(this.form.value).subscribe(
      (res:any)=>{
    // console.log("success" ,res)
      if(res.status==true){
        // this.toastr.success(res.message ,'success',{
        //   tapToDismiss:true,
        //   disableTimeOut:false,
        //   timeOut: 5000,
        //   positionClass: 'toast-bottom-right'
        // });
        this.dialogRef.close(true)
      }
      else {
        this.toastr.error(res.message,'error');
      }
    },
    (err:any) =>{
        this.toastr.error(err.error.errors[0],'error',{closeButton: true,
          tapToDismiss:true,
          disableTimeOut:false,
          timeOut: 5000,
          positionClass: 'toast-bottom-right'
        })
    })
  }

  close() {
    this.dialogRef.close()
  }
}
