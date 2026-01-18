import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import moment from 'moment';
import {MatInputModule} from '@angular/material/input';
import { NgSelectModule, } from '@ng-select/ng-select';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [NgSelectModule,MatInputModule, FormsModule , ReactiveFormsModule , CommonModule , MatDatepickerModule, MatFormFieldModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  form!: FormGroup;
  submitted: boolean=false;
  category: any;
selectedRolesIds: any;

types:any=[
  { name:"Money Amount",value:'amount'},
  { name:"Percent ",value:'percent'}
]
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,

  public dialogRef: MatDialogRef<EditComponent> , private formbuilder:FormBuilder , private cats:AppService , private toastr :ToastrService){

    this.category=data?.item

  }
  ngOnInit(): void {
    this.form = this.formbuilder.group({
    
      code:[this.category?.code,Validators.required],
      value:[this.category?.value,[Validators.required]],
      expiration_date:[null,Validators.required],
      allowed_usage_number:[
        this.category?.allowed_usage_number,[Validators.required, Validators.pattern('^[0-9]*$')]],
    
    })
    this.selectedRolesIds= this.category?.type

    this.form.patchValue({expiration_date:this.category?.expiration_date});
    console.log(  this.form.controls['expiration_date'].value);
 
  
  
  }
  get f():any{return this.form.controls}
  add(){

    this.submitted = true;
  
    if(this.form.invalid ||!this.selectedRolesIds){ return}
    let form ={
      promocode_id:this.category?.id,
      ...this.form.value,
  type:this.selectedRolesIds
    }
    console.log(form);
    
    this.cats.EditCode(form).subscribe((res:any)=>{
  
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
     },
     (err:any) =>{
  
    //   this.toastr.error(err.error.errors[0],'error',{closeButton: true,
    //     tapToDismiss:true,
    // disableTimeOut:false,
    // timeOut: 5000,
    // positionClass: 'toast-bottom-right',})
      
     })
      
      
    
  }
  
    close(){
      this.dialogRef.close()
    }
    dateValueChange(event:any) {
      console.log(event.value);
      
      
      this.form.controls['expiration_date'].setValue(moment(event.value).format('YYYY-MM-DD'));
        
        
      }
}
