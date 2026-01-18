
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgSelectModule, } from '@ng-select/ng-select';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [NgSelectModule , FormsModule , ReactiveFormsModule , CommonModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  pass_type: boolean=false;
  local:any=localStorage.getItem('permissions')
  roles:any='';
  selectedRolesIds:any
  form!: FormGroup;
submitted: boolean = false;
  admin: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,

  public dialogRef: MatDialogRef<EditComponent> , private formbuilder:FormBuilder , private admins:AppService , private toastr :ToastrService){
  this.roles=JSON.parse(this.local)
    this.admin=data?.item
    console.log(this.admin);
   
    this.selectedRolesIds=this.admin?.permissions.map((permission:any)=>permission.id)
  

  }
  ngOnInit(): void {
    this.form = this.formbuilder.group({

      name:[this.admin?.name,Validators.required],
      email:[this.admin?.email,[Validators.required ,
      Validators.email]] ,
     
      phone:[this.admin?.phone,[Validators.required ,
        Validators.pattern(/^5\d{8}$/)]] ,
        role:[this.admin?.role,Validators.required],
    })


}
get f():any{return this.form.controls}
add(){
console.log(this.selectedRolesIds);
this.submitted = true;

if(this.form.invalid ){ return}
let form ={
  admin_id: this.admin.id,
  ...this.form.value,
  permissions:this.selectedRolesIds
}
this.admins.EditAdmins(form).subscribe((res:any)=>{

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
