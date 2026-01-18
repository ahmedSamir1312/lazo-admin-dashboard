import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PalceholderTableComponent } from "../../../Shared/palceholder-table/palceholder-table.component";
import { CommonModule } from '@angular/common';
import { DeletePopupComponent } from '../../../Shared/delete-popup/delete-popup.component';
import { largepopup, smallpopup } from '../../../Shared/configration';
import { AddComponent } from '../add/add.component';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, PalceholderTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  header:any=['No.','Image','Cover', 'English Name' , 'Arabic Name' ,   'Active', 'Action' ]
  loading: boolean=true;
  categories: any=[];
  constructor(private cats:AppService , private toast:ToastrService , private dialog:MatDialog ){}
  ngOnInit(): void {
    this.showCats()
  }
  showCats(){
    
    this.cats.categories().subscribe((stats:any) =>{
      console.log(stats.data);
  this.categories=stats.data
      this.loading=false
    })
  }
  toggle(item: any ) {
    this.cats.toggleCats(item.id).subscribe((res :any) => {
     this.toast.success('', res.message,{
       closeButton: true,
       tapToDismiss:true,
   disableTimeOut:false,
   timeOut: 5000,
   positionClass: 'toast-bottom-right',
   });
   item.is_visible !=item.is_visible
    })
 }
 openDeleteModal(item: any,enterAnimationDuration: string, exitAnimationDuration: string) {
  var dialogRef = this.dialog.open(DeletePopupComponent, {...smallpopup ,  enterAnimationDuration,
    exitAnimationDuration, data:{
      title:item.name_en,
      desc:'Delete Category'
    }});
  dialogRef.afterClosed().subscribe((result:any) => {
if(result){
this.DeleteProduct(item.id)
}

  });


 }

 DeleteProduct(id:any) {
 this.cats.deleteCat(id).subscribe((res:any)=>{

  // console.log("success" ,res)
  if(res.status==true){
    this.toast.success(res.message ,'success',{
      tapToDismiss:true,
      disableTimeOut:false,
      timeOut: 5000,
      positionClass: 'toast-bottom-right'
    });
  this.showCats()


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
AddCats(enterAnimationDuration: string, exitAnimationDuration: string) {
  var dialogRef = this.dialog.open(AddComponent, {...largepopup ,  enterAnimationDuration,
    exitAnimationDuration,});
  dialogRef.afterClosed().subscribe((result:any) => {
if(result){
this.showCats()
}

  });
}
EditCat( item:any,enterAnimationDuration: string, exitAnimationDuration: string) {
  var dialogRef = this.dialog.open(EditComponent, {...largepopup ,  enterAnimationDuration,
    exitAnimationDuration,data:{
      item:item,
     
    }});
  dialogRef.afterClosed().subscribe((result:any) => {
if(result){
this.showCats()
}

  });
}
}
