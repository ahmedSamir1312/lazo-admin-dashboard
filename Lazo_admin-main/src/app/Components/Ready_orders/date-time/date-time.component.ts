import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgSelectModule } from '@ng-select/ng-select';
import moment from 'moment';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-date-time',
  standalone: true,
  imports: [NgSelectModule,MatInputModule, FormsModule , ReactiveFormsModule , CommonModule , MatDatepickerModule, MatFormFieldModule],
  templateUrl: './date-time.component.html',
  styleUrl: './date-time.component.scss'
})
export class DateTimeComponent implements OnInit {
  packaging_provider:any=null;
time: any;
types:any=[
  { name:"9:00 AM to 3:00 PM",value:'9:00 AM to 3:00 PM'},
  { name:"3:00 PM to 12:00 AM ",value:'3:00 PM to 12:00 AM '}
]
  order: any;
  form!: FormGroup;
  details: any=[];
  constructor(private orders:AppService ,
    public dialogRef: MatDialogRef<DateTimeComponent> ,private formbuilder:FormBuilder ,@Inject(MAT_DIALOG_DATA) public data: any, ){
      this.order=data?.item;
   
      
    }
    ngOnInit(): void {
    
      this.form = this.formbuilder.group({
       
        delivery_date:[moment(this.order.delivery_date).format('YYYY-MM-DD'),Validators.required],
      })
      this.time=this.order.delivery_time;
      if(this.order?.order_family=="collective"){
        this.orders.getProviders('active', 'packaging_provider', 1).subscribe((stats:any) =>{
 
          console.log(stats.data.data);
            
              this.details=stats.data.data
              this.packaging_provider=(this.order?.order_family=="collective")&& this.order?.packaging_provider_id?Number(this.order.packaging_provider_id):null;
              console.log(this.packaging_provider);
              
            })
      }
   
    }

    
  close(){
    this.order.packaging_provider_id=this.order?.order_family=="collective"?this.packaging_provider:this.order.packaging_provider_id;
  this.order.delivery_time=this.time;
  this.order.delivery_date=moment(this.form.controls['delivery_date'].value, "YYYY-MM-DD").format("DD MMM YYYY");
   
  console.log(this.order);
  this.dialogRef.close(this.order)
  }
  dateValueChange(event:any) {
    console.log(event.value);
    this.form.controls['delivery_date'].setValue(moment(event.value).format('YYYY-MM-DD'));
    
    
      
      
    }
}
