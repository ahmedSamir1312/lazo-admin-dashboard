import { Component, Inject } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { largepopup } from '../../../Shared/configration';
import { MapComponent } from '../../Service_Providers/map/map.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule , CommonModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  Countries: any=[];
  item: any;
  form!: FormGroup;
  submitted: boolean=false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,

  public dialogRef: MatDialogRef<EditComponent> , private formbuilder:FormBuilder , private cats:AppService , private toastr :ToastrService,private dialog:MatDialog){
this.item=data?.item
    this.Countries=data?.Countries

  }
  ngOnInit(): void {
    this.form = this.formbuilder.group({

      name_en:[this.item?.name_en,Validators.required],
      name_ar:[this.item?.name_ar,Validators.required],
    country_id:[Number(this.item?.country_id),Validators.required],
    lat:[this.item?.lat,Validators.required],
    lng:[this.item?.lng,Validators.required],
    })


  }
  get f():any{return this.form.controls}
  add(){

    this.submitted = true;

    if(this.form.invalid){ return}
    let form ={

      city_id:this.item.id,
      ...this.form.value,

    }
    this.cats.editCity(form).subscribe((res:any)=>{

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
   openMap( enterAnimationDuration: string, exitAnimationDuration: string) {
      var dialogRef = this.dialog.open(MapComponent, {...largepopup ,  enterAnimationDuration,
        exitAnimationDuration,
          data: {title:'Pick Location', data:{
lat:this.form.get('lat')?.value,
lng:this.form.get('lng')?.value,
from:'cities'
          }}

        });
      dialogRef.afterClosed().subscribe((result:any) => {
    if(result){
      console.log(result,
        'Pick Location');

      this.form.patchValue({
        lat:result?.lat,
        lng:result?.long
       })


    }

      });}
}
