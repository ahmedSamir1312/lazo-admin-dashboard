import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatDialogRef } from '@angular/material/dialog';

import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add',
  standalone: true,
  imports: [ FormsModule , ReactiveFormsModule , CommonModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent  implements OnInit{
  form!: FormGroup;
submitted: boolean=false;
constructor(
  public dialogRef: MatDialogRef<AddComponent> , private formbuilder:FormBuilder , private admins:AppService , private toastr :ToastrService){

    
  }
ngOnInit(): void {
  this.form = this.formbuilder.group({
  
    name_en:[null,Validators.required],
    name_ar:[null,Validators.required],
  
  })


}
get f():any{return this.form.controls}
add(){

  this.submitted = true;

  if(this.form.invalid){ return}
  let form ={
    
    ...this.form.value,

  }
  this.admins.addTag(form).subscribe((res:any)=>{

      // console.log("success" ,res)
      if(res.status==true){
        this.toastr.success(res.message ,'success',{
          tapToDismiss:true,
          disableTimeOut:false,
          timeOut: 5000,
          positionClass: 'toast-bottom-right'
        });
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
  positionClass: 'toast-bottom-right',})
    
   })
    
    
  
}

  close(){
    this.dialogRef.close()
  }

}
