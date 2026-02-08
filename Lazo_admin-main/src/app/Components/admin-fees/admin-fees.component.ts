import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgSelectModule, } from '@ng-select/ng-select';
import { AppService } from '../../services/app.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-admin-fees',
  standalone: true,
  imports: [CommonModule, FormsModule, MatExpansionModule, ReactiveFormsModule , NgSelectModule],
  templateUrl: './admin-fees.component.html',
  styleUrl: './admin-fees.component.scss'
})

export class AdminFeesComponent implements OnInit {
  form!:FormGroup;
  additional_wrapping_submitted:boolean=false;
  additional_collection_submitted:boolean=false;
  delivery_submitted:boolean=false;
  activePanel:string='delivery';
  types:any=[{name:'Wrapping Fee' , value:'wrapping_fee'},{name:'Collection Fee' , value:'collection_fee'}]
  constructor(private formBuilder:FormBuilder , private service:AppService , private toast:ToastrService) {}

  ngOnInit(): void {
    this.form= this.formBuilder.group({
      delivery: this.formBuilder.group({
        amount:[null,[Validators.required , Validators.min(0)]],
        free_shipping_threshold:[null,[Validators.required , Validators.min(0)]],
      }), 
      additional_wrapping: this.formBuilder.group({   
        type:['wrapping_fee',Validators.required],
        base_amount:[null,[Validators.required , Validators.min(0)]],
        extra_amount:[null,[Validators.required , Validators.min(0)]]
      }),
      additional_collection: this.formBuilder.group({  
        type:['collection_fee',Validators.required],
        base_amount:[null,[Validators.required , Validators.min(0)]],
        extra_amount:[null,[Validators.required , Validators.min(0)]]
      })
    })

    this.deliveryDetails();
    this.additionalDetails();
  }

  get f():any {
    return this.form.controls;
  }

  setActivePanel(tab_name:string) {

  }

  deliveryDetails() {
    this.service.loadDeliveryFees().subscribe((res:any)=>{
      console.log("deliveryDetails",res?.data[0]?.amount)
      if(res?.data[0]?.amount) { 
      this.f['delivery'].patchValue({
        amount:res?.data[0]?.amount,
        free_shipping_threshold:res?.data[0]?.free_shipping_threshold
      })
      }
    })
  }
 

  additionalDetails() {
    this.service.loadAdditionalFees().subscribe((res:any)=>{
      console.log("additional",res?.data) 
      if(res?.data?.collection_fee) { 
      this.f['additional_collection'].patchValue({
        base_amount:res?.data?.collection_fee?.base_amount,
        extra_amount:res?.data?.collection_fee?.extra_amount
      })
      }
     if(res?.data?.wrapping_fee) { 
      this.f['additional_wrapping'].patchValue({
        base_amount:res?.data?.wrapping_fee?.base_amount,
        extra_amount:res?.data?.wrapping_fee?.extra_amount
      })
      }
    })
  }

 
  saveAdditional(type:any) {
   
    switch(type) {
      case 'collection_fee' :{
        this.additional_collection_submitted=true;   
        if(this.f['additional_collection'].invalid) {
          console.log("saveAdditional",this.f['additional_collection'].invalid)
          return;
        }

        this.service.changeAdditionalFees(this.form.value.additional_collection).subscribe((res:any)=>{
        if (res.status == true) {
          this.toast.success(res?.message, 'Success',{ timeOut: 3000, positionClass: 'toast-top-right' });
          this.additionalDetails();
        } 
        else {
          this.toast.error(res?.message, 'Error');
        }
        },
        (err:any) => {
          this.additional_collection_submitted=false;
          this.toast.error(err?.error?.errors[0], 'Error');
        });  
        break;
      }
      case 'wrapping_fee' :{
        this.additional_wrapping_submitted=true; 
        if(this.f['additional_wrapping'].invalid) {
          console.log("saveAdditional",this.f['additional_wrapping'].invalid)
          return;
        }

        this.service.changeAdditionalFees(this.form.value.additional_wrapping).subscribe((res:any)=>{
        if (res.status == true) {
          this.toast.success(res?.message, 'Success',{ timeOut: 3000, positionClass: 'toast-top-right' });
          this.additionalDetails();
        } 
        else {
          this.toast.error(res?.message, 'Error');
        }
        },
        (err:any) => {
          this.additional_wrapping_submitted=false;
          this.toast.error(err?.error?.errors[0], 'Error');
        });    
         
        break;
      }
    }
     
  }

  saveDelivery() {
    this.delivery_submitted=true;
    if(this.f['delivery'].invalid) {
      console.log("saveDelivery",this.form.controls['delivery'].valid)
      return;
    }

    this.service.changeDeliveryFees(this.form.value.delivery).subscribe((res:any)=>{
      if (res.status == true) {
        this.toast.success(res?.message, 'Success',{ timeOut: 3000, positionClass: 'toast-top-right' });
        this.deliveryDetails();
      } 
      else {
        this.toast.error(res?.message, 'Error');
      }
      },
      (err:any) => {
      this.delivery_submitted=false;
      this.toast.error(err?.error?.errors[0], 'Error');
    });    
         
  }

 
}
