import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgOtpInputModule } from 'ng-otp-input';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [ NgOtpInputModule],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss'
})
export class VerifyComponent  implements OnInit {
  email_or_phone:any
  otp: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<VerifyComponent>,private authService:AuthService ,  private toastr: ToastrService,){
    console.log(data);
    this.email_or_phone=data?.email_or_phone
  }
  ngOnInit(): void {
    this.sendCode()
  }
  sendCode(){
    let form ={
      email_or_phone:this.email_or_phone,
      account_type:'provider'
    }
    this.authService.sendOtpMessage(form).subscribe((res:any)=>{
      // console.log("success" ,res)
      if(res.status==true){
        this.toastr.success('', res.message,{
          closeButton: true,
          tapToDismiss:true,
      disableTimeOut:false,
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      });
      }
      else{
        this.toastr.error(res.errors[0],'error');
      }
    },
    (err:any)=>{
      this.toastr.error(err.error.errors[0],'error')
    })
  }
  confirmCode(){
    let form ={
      email_or_phone:this.email_or_phone,
      confirm_code:this.otp,
      account_type:'provider'
    }
    this.authService.confirmOtpMessage(form).subscribe((res:any)=>{
      // console.log("success" ,res)
      if(res.status==true){
        this.toastr.success('', res.message,{
          closeButton: true,
          tapToDismiss:true,
      disableTimeOut:false,
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      });
      this.dialogRef.close(true);
      }
     
    },
    (err:any)=>{
     
    })
  }
  onOtpChange(event:any){
 this.otp=event
  
  }
}
