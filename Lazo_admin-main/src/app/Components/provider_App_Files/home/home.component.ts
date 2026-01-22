import { Component, OnDestroy, OnInit } from '@angular/core';
import { PalceholderTableComponent } from '../../../Shared/palceholder-table/palceholder-table.component';
import { CommonModule } from '@angular/common';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../Shared/delete-popup/delete-popup.component';
import { largepopup, smallpopup } from '../../../Shared/configration';
import { AddComponent } from '../add/add.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatExpansionModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit , OnDestroy{
  loading: boolean = true;
  files: any;
  termsSubmitted:boolean =false;
  policiesSubmitted:boolean =false;
  aboutUsSubmitted:boolean = false;
  form!:FormGroup;
  activePanel: string = 'terms';
  constructor(
    private service: AppService,
    private toast: ToastrService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private formBuilder:FormBuilder
  ) {}

  ngOnInit(): void {
     const savedPanel = localStorage.getItem('client_active_panel');
    if (savedPanel) {
      this.activePanel = savedPanel;
    }

    this.form = this.formBuilder.group({
      type : ['provider',Validators.required],
      terms: this.formBuilder.group({
        terms_conditions_en: [null, [Validators.required , Validators.pattern("^[A-Za-z0-9\\s.,!?;:(){}\\[\\]<>\"'\\-]+$")]],
        terms_conditions_ar: [null, [Validators.required , Validators.pattern("^[\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9\\s.,!?؛:(){}\\[\\]<>ـ«»\"'\\-]+$")]],
      }),
      policies: this.formBuilder.group({
        privacy_policy_en: [null, [Validators.required , Validators.pattern("^[A-Za-z0-9\\s.,!?;:(){}\\[\\]<>\"'\\-]+$")]],
        privacy_policy_ar: [null, [Validators.required , Validators.pattern("^[\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9\\s.,!?؛:(){}\\[\\]<>ـ«»\"'\\-]+$")]],
      }),
      about: this.formBuilder.group({
        about_app_en: [null, [Validators.required , Validators.pattern("^[A-Za-z0-9\\s.,!?;:(){}\\[\\]<>\"'\\-]+$")]],
        about_app_ar: [null, [Validators.required , Validators.pattern("^[\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9\\s.,!?؛:(){}\\[\\]<>ـ«»\"'\\-]+$")]],
      })
    })

    this.showProviderAppFiles();
  }

  setActivePanel(panel: string) {
    this.activePanel = panel;
    localStorage.setItem('client_active_panel', panel);
  }

  showProviderAppFiles() {
   this.loading = true;
   this.spinner.show();
    this.service.appInfo().subscribe((response: any) => {
      console.log(response.data);
      this.spinner.hide();
      this.form.controls['terms'].patchValue({
        terms_conditions_en: response.data?.provider_app_info?.terms_conditions_en,
        terms_conditions_ar:response.data?.provider_app_info?.terms_conditions_ar,
      })

      this.form.controls['policies'].patchValue({
        privacy_policy_en: response.data?.provider_app_info?.privacy_policy_en,
        privacy_policy_ar:response.data?.provider_app_info?.privacy_policy_ar,
      })

      this.form.controls['about'].patchValue({
        about_app_en: response.data?.provider_app_info?.about_app_en,
        about_app_ar:response.data?.provider_app_info?.about_app_ar,
      })
      
     
      this.files = response.data;
      this.loading = false;
    },()=>{
      this.loading=false;
      this.spinner.hide();
    });
  }
  
  get f():any {
    return this.form.controls;
  }

  saveTerms() {
   this.termsSubmitted=true;
    if (this.f['terms'].invalid) {
      this.toast.warning('Please enter terms and conditions content', 'Warning');
      return;
    }
    // console.log(this.form.value.terms)
    const form = {
     ...this.form.value.terms,
     type:this.form.value.type
    };

    this.service.setfile(form).subscribe((setRes: any) => {
      this.termsSubmitted=false;
      if (setRes.status == true) {
        this.toast.success('Terms and conditions saved successfully!', 'Success',{ timeOut: 3000, positionClass: 'toast-top-right' });
        this.showProviderAppFiles();
      } 
      else {
        this.toast.error(setRes.message, 'Error');
      }
    },
    (setErr: any) => {
      this.termsSubmitted=false;
      this.toast.error(setErr.error.errors[0], 'Error');
    });  
  }

  savePrivacy() {
    this.policiesSubmitted=true;
    if (this.f['policies'].invalid) {
      this.toast.warning('Please enter privacy policy content', 'Warning');
      return;
    }
    // console.log(this.form.value.policies)
    const form = {
     ...this.form.value.policies,
     type:this.form.value.type
    };

    this.service.setfile(form).subscribe((setRes: any) => {
      this.policiesSubmitted=false;
      if (setRes.status == true) {
        this.toast.success('Privacy policy saved successfully!', 'Success',{ timeOut: 3000, positionClass: 'toast-top-right' });
        this.showProviderAppFiles();
      } 
      else {
        this.toast.error(setRes.message, 'Error');
      }
    },
    (setErr: any) => {
      this.policiesSubmitted=false;
      this.toast.error(setErr.error.errors[0], 'Error');
    });  
  }

  saveAboutUs() {
    this.aboutUsSubmitted=true;
    if (this.f['about'].invalid) {
      this.toast.warning('Please enter about us content', 'Warning');
      return;
    }
    // console.log(this.form.value.policies)
    const form = {
     ...this.form.value.about,
     type:this.form.value.type
    };

    this.service.setfile(form).subscribe((setRes: any) => {
      this.aboutUsSubmitted=false;
      if (setRes.status == true) {
        this.toast.success('About saved successfully!', 'Success',{ timeOut: 3000, positionClass: 'toast-top-right' });
        this.showProviderAppFiles();
      } 
      else {
        this.toast.error(setRes.message, 'Error');
      }
    },
    (setErr: any) => {
      this.aboutUsSubmitted=false;
      this.toast.error(setErr.error.errors[0], 'Error');
    });  
  }
   
  addContact(
    item: any,
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    var dialogRef = this.dialog.open(AddComponent, {
      ...largepopup,
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        item: item,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.toast.success(
          'Contact information updated successfully!',
          'Success',
          {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          }
        );
        this.showProviderAppFiles();
      }
    });
  }
  
  ngOnDestroy(): void {
    localStorage.removeItem('client_active_panel');
  }
}
