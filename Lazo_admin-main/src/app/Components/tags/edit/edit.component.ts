import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ FormsModule , ReactiveFormsModule , CommonModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  form!: FormGroup;
  submitted: boolean=false;
  category: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,

  public dialogRef: MatDialogRef<EditComponent> , private formbuilder:FormBuilder , private cats:AppService , private toastr :ToastrService){

    this.category=data?.item

  }
  ngOnInit(): void {
    this.form = this.formbuilder.group({
    
      name_en:[this.category?.name_en,Validators.required],
      name_ar:[this.category?.name_ar,Validators.required],
    
    })
  
  
  }
  get f():any{return this.form.controls}
  add(){
  
    this.submitted = true;
  
    if(this.form.invalid){ return}
    let form ={
     tag_id:this.category.id,
      ...this.form.value,
  
    }
    this.cats.EditTag(form).subscribe((res:any)=>{
  
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
