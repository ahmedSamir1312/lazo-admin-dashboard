import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../services/app.service';
import { PalceholderTableComponent } from "../../../Shared/palceholder-table/palceholder-table.component";
import { AddComponent } from '../add/add.component';
import { largepopup, smallpopup } from '../../../Shared/configration';
import { EditComponent } from '../edit/edit.component';
import { DeletePopupComponent } from '../../../Shared/delete-popup/delete-popup.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PalceholderTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  Countries: any=[];



  header:any=['No.','City in English' , 'City in Arabic ', 'Latitude && Longitude' , 'Action' ]
  loading: boolean=true;
  Cities: any=[];
  constructor(private cats:AppService , private toast:ToastrService , private dialog:MatDialog ){}
  ngOnInit(): void {
    this.showCities()
    this.showCountries()
  }
  showCities(){

    this.cats.getAllCities().subscribe((stats:any) =>{
      console.log(stats.data);
  this.Cities=stats.data
      this.loading=false
    })
  }
  showCountries(){

    this.cats.getAllCountries().subscribe((stats:any) =>{
      console.log(stats.data);
  this.Countries=stats.data
      this.loading=false
    })
  }
  AddCats(enterAnimationDuration: string, exitAnimationDuration: string) {
    var dialogRef = this.dialog.open(AddComponent, {...largepopup ,  enterAnimationDuration,
      exitAnimationDuration,
      data:{
        Countries: this.Countries
      }
    });
    dialogRef.afterClosed().subscribe((result:any) => {
  if(result){
  this.showCities()
  }

    });
  }
  EditCat( item:any,enterAnimationDuration: string, exitAnimationDuration: string) {
    var dialogRef = this.dialog.open(EditComponent, {...largepopup ,  enterAnimationDuration,
      exitAnimationDuration,data:{
        item:item,
        Countries: this.Countries
      }});
    dialogRef.afterClosed().subscribe((result:any) => {
  if(result){
  this.showCities()
  }

    });
  }
     openDeleteModal(item: any,enterAnimationDuration: string, exitAnimationDuration: string) {
      var dialogRef = this.dialog.open(DeletePopupComponent, {...smallpopup ,  enterAnimationDuration,
        exitAnimationDuration, data:{
          title:item.name_en,
          desc:'Delete City'
        }});
      dialogRef.afterClosed().subscribe((result:any) => {
    if(result){
    this.DeleteProduct(item.id)
    }

      });


     }

     DeleteProduct(id:any) {
     this.cats.deleteCity(id).subscribe((res:any)=>{

      // console.log("success" ,res)
      if(res.status==true){
        this.toast.success(res.message ,'success',{
          tapToDismiss:true,
          disableTimeOut:false,
          timeOut: 5000,
          positionClass: 'toast-bottom-right'
        });
      this.showCities()


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
