import { largepopup, smallpopup } from './../../../Shared/configration';
import { Component } from '@angular/core';
import { PalceholderTableComponent } from "../../../Shared/palceholder-table/palceholder-table.component";
import { CommonModule } from '@angular/common';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { AdminDetailsComponent } from '../admin-details/admin-details.component';
import { DeletePopupComponent } from '../../../Shared/delete-popup/delete-popup.component';
import { AddComponent } from '../add/add.component';
import { EditComponent } from '../edit/edit.component';
@Component({
  selector: 'app-show',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, PalceholderTableComponent],
  templateUrl: './show.component.html',
  styleUrl: './show.component.scss'
})
export class ShowComponent {
  loading:boolean=true;
 
  header:any=['No.','Admin Name' , 'Role Name' , 'Phone Number', 'Roles',  'Active' ,'Block', 'Action' ]
  
    Admins:any=[] 
    constructor(private admins:AppService , private toast:ToastrService , private dialog:MatDialog){}
    ngOnInit(): void {
      this.showAdmins()
    }
    showAdmins(){
      
      this.admins.admins().subscribe((stats:any) =>{
        console.log(stats.data);
    this.Admins=stats.data
        this.loading=false
      })
    }
    toggle(item: any , status:any) {
      this.admins.toggleAdmin({admin_id:item.id, status:status}).subscribe((res :any) => {
       this.toast.success('', res.message,{
         closeButton: true,
         tapToDismiss:true,
     disableTimeOut:false,
     timeOut: 5000,
     positionClass: 'toast-bottom-right',
     });
     if(item.status=='active'){
item.status='blocked'
     }
     else    if(item.status=='blocked'){
      item.status='active'
           }
      })
   }
   showDetails(item: any,enterAnimationDuration: string, exitAnimationDuration: string) {
      var dialogRef = this.dialog.open(AdminDetailsComponent, {...largepopup ,  enterAnimationDuration,
        exitAnimationDuration, data:{
          item:item
        }});
      dialogRef.afterClosed().subscribe((result:any) => {
   
    
      });
    }
    AddAdmin(enterAnimationDuration: string, exitAnimationDuration: string) {
      var dialogRef = this.dialog.open(AddComponent, {...largepopup ,  enterAnimationDuration,
        exitAnimationDuration,});
      dialogRef.afterClosed().subscribe((result:any) => {
   if(result){
    this.showAdmins()
   }
    
      });
    }
    EditAdmin( item:any,enterAnimationDuration: string, exitAnimationDuration: string) {
      var dialogRef = this.dialog.open(EditComponent, {...largepopup ,  enterAnimationDuration,
        exitAnimationDuration,data:{
          item:item,
         
        }});
      dialogRef.afterClosed().subscribe((result:any) => {
   if(result){
    this.showAdmins()
   }
    
      });
    }
    openDeleteModal(item: any,enterAnimationDuration: string, exitAnimationDuration: string) {
      var dialogRef = this.dialog.open(DeletePopupComponent, {...smallpopup ,  enterAnimationDuration,
        exitAnimationDuration, data:{
          title:item.name,
          desc:'Delete Admin'
        }});
      dialogRef.afterClosed().subscribe((result:any) => {
   if(result){
    this.DeleteProduct(item.id)
   }
    
      });
    
  
     }
  
     DeleteProduct(id:any) {
     this.admins.deleteAdmin(id).subscribe((res:any)=>{

      // console.log("success" ,res)
      if(res.status==true){
        this.toast.success(res.message ,'success',{
          tapToDismiss:true,
          disableTimeOut:false,
          timeOut: 5000,
          positionClass: 'toast-bottom-right'
        });
      this.showAdmins()
  
  
      } else {
        this.toast.error(res.message,'error');
      }
   },
   (err:any) =>{
  
    this.toast.error(err.error.errors[0],'error',{closeButton: true,
      tapToDismiss:true,
  disableTimeOut:false,
  timeOut: 5000,
  positionClass: 'toast-bottom-right',})
    
   })
    
    
  
  }
   }

