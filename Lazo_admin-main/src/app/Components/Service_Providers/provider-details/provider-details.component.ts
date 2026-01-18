import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import {MatExpansionModule} from '@angular/material/expansion';
import { VerifyComponent } from '../verify/verify.component';
import { smallpopup } from '../../../Shared/configration';
import { DeletePopupComponent } from '../../../Shared/delete-popup/delete-popup.component';
import { TransactionsComponent } from "../transactions/transactions.component";
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-provider-details',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatSlideToggleModule,
    RouterModule,
    MatTabsModule,
    TransactionsComponent,
    FormsModule
],
  templateUrl: './provider-details.component.html',
  styleUrl: './provider-details.component.scss',
})
export class ProviderDetailsComponent {
  matTabGroup: any;
  provider: any;
  tags: any = '';
  days:any=[{value:0 , name:'Sunday'},{value:1 , name:'Monday'} ,{value:2 , name:'Tuesday'},{value:3 , name:'Wednesday'},{value:4 , name:'Thursday'},{value:5 , name:'Friday'},{value:6 , name:'Saturday'} ]
  daysSentence: any;
  updatePercent:boolean = false;
  app_percent: any;
  index: any;
  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private providers: AppService,
    private toastr: ToastrService,
    private location:Location
  ) {
    this.activatedRoute.data.subscribe((data: any) => {
      this.provider = data.provider.data;
      this.app_percent= this.provider.app_percent;
      const filteredDays = this.days.filter((day: any) => this.provider.working_days_indices_list.includes(String(day.value)));

// استخراج أسماء الأيام المطلوبة وتكوين جملة
 this.daysSentence = filteredDays.map((day: { name: any; }) => day.name).join(', ');


      this.provider.tags.forEach((element: any) => {
        this.tags += element.name_en + ' ' + ' - ';
      });
    });
    console.log(this.provider);
  }
  resetShowItem(event: any) {
    console.log(event);
    this.index=event?.index
  }
  back(){
    this.location.back()
  }
  toggle(item: any) {
    this.providers.toggleProvider({provider_id:item.id, status:item.status=='active'?'block':'unblock'}).subscribe((res :any) => {
     this.toastr.success('', res.message,{
       closeButton: true,
       tapToDismiss:true,
   disableTimeOut:false,
   timeOut: 5000,
   positionClass: 'toast-bottom-right',
   });
   item.status= res.data.status
    })
 }
  updatePercentFunc(){
    this.providers.Update_app_percent({provider_id:this.provider.id, app_percent:this.app_percent}).subscribe((res :any) => {
      this.toastr.success('', res.message,{
        closeButton: true,
        tapToDismiss:true,
    disableTimeOut:false,
    timeOut: 5000,
    positionClass: 'toast-bottom-right',
    });
    this.providers.reloadData(true)
    this.updatePercent = false
     })
   
  }
 verify_provider(item: any,type:any,enterAnimationDuration: string, exitAnimationDuration: string) {
  var dialogRef = this.dialog.open(VerifyComponent, {...smallpopup ,  enterAnimationDuration,
    exitAnimationDuration, data:{
      email_or_phone: type=='email'?item.email:item.phone
      
    }});
  dialogRef.afterClosed().subscribe((result:any) => {
if(result){
if(type=='email'){
  item.is_email_verified =true
}else{
  
    item.is_phone_verified =true
  
}
}

  });


 }
 togglePending(item: any , status:any) {
  this.providers.toggleProvider({provider_id:item.id, status:status}).subscribe((res :any) => {
   this.toastr.success('', res.message,{
     closeButton: true,
     tapToDismiss:true,
 disableTimeOut:false,
 timeOut: 5000,
 positionClass: 'toast-bottom-right',
 });
 item.status=res.data.status
  })
}
openDeleteModal(item: any,enterAnimationDuration: string, exitAnimationDuration: string) {
  var dialogRef = this.dialog.open(DeletePopupComponent, {...smallpopup ,  enterAnimationDuration,
    exitAnimationDuration, data:{
      title:item.name,
      desc:'Delete Provider'
    }});
  dialogRef.afterClosed().subscribe((result:any) => {
if(result){
  this.providers.toggleProvider({provider_id:item.id, status:'deleted'}).subscribe((res :any) => {
    this.toastr.success('', res.message,{
      closeButton: true,
      tapToDismiss:true,
  disableTimeOut:false,
  timeOut: 5000,
  positionClass: 'toast-bottom-right',
  });
  this.back()
   })
 
}
  });


 }
}
