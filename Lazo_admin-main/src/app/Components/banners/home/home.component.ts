import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { EditComponent } from '../edit/edit.component';
import { AddComponent } from '../add/add.component';
import { largepopup, smallpopup } from '../../../Shared/configration';
import { PalceholderTableComponent } from "../../../Shared/palceholder-table/palceholder-table.component";
import { DeletePopupComponent } from '../../../Shared/delete-popup/delete-popup.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PalceholderTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  header:any=['No.','Title' , 'Image ' , 'Action' ]
  loading: boolean=true;
  Banners: any=[];
  constructor(private bannerservice:AppService , private toast:ToastrService , private dialog:MatDialog ){}
  ngOnInit(): void {
    this.showBanners()
  }
  showBanners(){
    
    this.bannerservice.allBanners().subscribe((stats:any) =>{
      console.log(stats.data);
  this.Banners=stats.data
      this.loading=false
    })
  }
  AddBanner (enterAnimationDuration: string, exitAnimationDuration: string) {
    var dialogRef = this.dialog.open(AddComponent, {...largepopup ,  enterAnimationDuration,
      exitAnimationDuration,});
    dialogRef.afterClosed().subscribe((result:any) => {
  if(result){
this.showBanners()
  }
  
    });
  }
  EditBanner( item:any,enterAnimationDuration: string, exitAnimationDuration: string) {
    var dialogRef = this.dialog.open(EditComponent, {...largepopup ,  enterAnimationDuration,
      exitAnimationDuration,data:{
        item:item,
       
      }});
    dialogRef.afterClosed().subscribe((result:any) => {
  if(result){
  this.showBanners()
  }
  
    });
  }
  openDeleteModal(item: any,enterAnimationDuration: string, exitAnimationDuration: string) {
    var dialogRef = this.dialog.open(DeletePopupComponent, {...smallpopup ,  enterAnimationDuration,
      exitAnimationDuration, data:{
        title:item.title,
        desc:'Delete Banner'
      }});
    dialogRef.afterClosed().subscribe((result:any) => {
  if(result){
  this.DeleteProduct(item.id)
  }
  
    });
  
  
   }
  
   DeleteProduct(id:any) {
   this.bannerservice.deleteBanner(id).subscribe((res:any)=>{
  
    // console.log("success" ,res)
    if(res.status==true){
      this.toast.success(res.message ,'success',{
        tapToDismiss:true,
        disableTimeOut:false,
        timeOut: 5000,
        positionClass: 'toast-bottom-right'
      });
this.showBanners()
  
  
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
