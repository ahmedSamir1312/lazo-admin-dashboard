import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../Shared/delete-popup/delete-popup.component';
import { largepopup, smallpopup } from '../../../Shared/configration';
import { AddComponent } from '../add/add.component';
import { EditComponent } from '../edit/edit.component';
import { PalceholderTableComponent } from "../../../Shared/palceholder-table/palceholder-table.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PalceholderTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  header:any=['No.','Image','Country in English' , 'Country in Arabic ' , 'Action' ]
  loading: boolean=true;
    Countries: any=[];
  constructor(private cats:AppService , private toast:ToastrService , private dialog:MatDialog ){}
  ngOnInit(): void {
    this.showCountries()
  }
  showCountries(){

    this.cats.getAllCountries().subscribe((stats:any) =>{
      console.log(stats.data);
  this.Countries=stats.data
      this.loading=false
    })
  }
   openDeleteModal(item: any,enterAnimationDuration: string, exitAnimationDuration: string) {
    var dialogRef = this.dialog.open(DeletePopupComponent, {...smallpopup ,  enterAnimationDuration,
      exitAnimationDuration, data:{
        title:item.name_en,
        desc:'Delete Country'
      }});
    dialogRef.afterClosed().subscribe((result:any) => {
  if(result){
  this.DeleteProduct(item.id)
  }

    });


   }

   DeleteProduct(id:any) {
   this.cats.deleteCountry(id).subscribe((res:any)=>{

    // console.log("success" ,res)
    if(res.status==true){
      this.toast.success(res.message ,'success',{
        tapToDismiss:true,
        disableTimeOut:false,
        timeOut: 5000,
        positionClass: 'toast-bottom-right'
      });
    this.showCountries()


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
  this.showCountries()
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
  this.showCountries()
  }

    });
  }
}
