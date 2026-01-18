import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatDialogRef } from '@angular/material/dialog';
import { NgSelectModule, } from '@ng-select/ng-select';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add',
  standalone: true,
  imports: [NgSelectModule , FormsModule , ReactiveFormsModule , CommonModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent implements OnInit {
  pass_type: boolean=false;
  local:any=localStorage.getItem('permissions')
  roles:any='';
  selectedRolesIds:any=[]
  form!: FormGroup;
submitted: boolean = false;
  constructor(
  public dialogRef: MatDialogRef<AddComponent> , private formbuilder:FormBuilder , private admins:AppService , private toastr :ToastrService){
  this.roles=JSON.parse(this.local)
    
  }

    ngOnInit(): void {
      this.form = this.formbuilder.group({
  
        name:[null,Validators.required],
        email:[null,[Validators.required ,
        Validators.email]] ,
        password:[null,Validators.required],
        phone:[null,[Validators.required ,
          Validators.pattern(/^5\d{8}$/)]] ,
          role:[null,Validators.required],
      })
  
    
  }
  get f():any{return this.form.controls}
add(){
  console.log(this.selectedRolesIds);
  this.submitted = true;

  if(this.form.invalid){ return}
  let form ={
    
    ...this.form.value,
    permissions:this.selectedRolesIds
  }
  this.admins.addAdmins(form).subscribe((res:any)=>{

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
