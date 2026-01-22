import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule , FormsModule , ReactiveFormsModule ],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss'
})
export class FaqsComponent {

  submitted: boolean = false;
  form!: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<FaqsComponent> , private formbuilder:FormBuilder , private service:AppService , private toastr :ToastrService){
    console.log(data.item);
  }
 
  ngOnInit(): void {
    this.form = this.formbuilder.group({
      question_en:[null,[Validators.required, Validators.pattern("^[A-Za-z0-9\\s.,!?;:(){}\\[\\]<>\"'\\-]+$")]] ,
      answer_en:[null,[Validators.required, Validators.pattern("^[A-Za-z0-9\\s.,!?;:(){}\\[\\]<>\"'\\-]+$")]] ,
      question_ar:[null,[Validators.required, Validators.pattern("^[\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9\\s.,!?؛:(){}\\[\\]<>ـ«»\"'\\-]+$")]] ,
      answer_ar:[null,[Validators.required, Validators.pattern("^[\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9\\s.,!?؛:(){}\\[\\]<>ـ«»\"'\\-]+$")]] ,
    })

    if(this.data?.item && this.data?.status=='edit') {
      this.details();
    }
  }

  details() {
    this.form.patchValue({
      question_en:this.data.item.question_en,
      answer_en:this.data.item.answer_en,
      question_ar:this.data.item.question_ar,
      answer_ar:this.data.item.answer_ar,
    })
  }

  get f():any{return this.form.controls}

  save() {
    this.submitted = true;
    if(this.form.invalid){ return}
    if(this.data.status=='add') {
      this.add();
    }
    else if (this.data.status=='edit'){
      this.edit();
    }
  }

  close() {
    this.dialogRef.close()
  }

  add() {
    this.service.createFaq(this.form.value).subscribe((res:any)=>{
      this.submitted= false;
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
       this.submitted= false
      this.toastr.error(err.error.errors[0],'error',{closeButton: true,
      tapToDismiss:true,
      disableTimeOut:false,
      timeOut: 5000,
      positionClass: 'toast-bottom-right'
    })
        
    })
  }

  edit() {
    const form:any = {
      faq_id:this.data?.item?.id,
      ...this.form.value,
    }
    this.service.updateFaq(form).subscribe((res:any)=>{
      this.submitted= false;
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
       this.submitted= false
      this.toastr.error(err.error.errors[0],'error',{closeButton: true,
      tapToDismiss:true,
      disableTimeOut:false,
      timeOut: 5000,
      positionClass: 'toast-bottom-right'
    })
        
   })
    
  }
}