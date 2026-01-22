import { Component, OnInit } from '@angular/core';
import { PalceholderTableComponent } from '../../../Shared/palceholder-table/palceholder-table.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../Shared/delete-popup/delete-popup.component';
import { largepopup, smallpopup } from '../../../Shared/configration';
import { AddComponent } from '../add/add.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PalceholderTableComponent, CommonModule, FormsModule ,ReactiveFormsModule, MatExpansionModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

//client
export class HomeComponent implements OnInit {
  loading: boolean = true;
  files: any;
  termsSubmitted:boolean =false;
  policiesSubmitted:boolean =false;
  termsContent: string = '';
  aboutContent: string = '';
  isEditingTerms: boolean = false;
  isEditingAbout: boolean = false;
  aboutUsSubmitted:boolean = false;
  form!:FormGroup;
  constructor(
    private service: AppService,
    private toast: ToastrService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private formBuilder:FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      type : ['client',Validators.required],
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

    this.showClientAppFiles();
  }

  showClientAppFiles() {
   this.loading = true;
   this.spinner.show();
    this.service.appInfo().subscribe((response: any) => {
      console.log(response.data);
      this.spinner.hide();
      this.form.controls['terms'].patchValue({
        terms_conditions_en: response.data?.client_app_info?.terms_conditions_en,
        terms_conditions_ar:response.data?.client_app_info?.terms_conditions_ar,
      })

      this.form.controls['policies'].patchValue({
        privacy_policy_en: response.data?.client_app_info?.privacy_policy_en,
        privacy_policy_ar:response.data?.client_app_info?.privacy_policy_ar,
      })
      
     this.form.controls['about'].patchValue({
        about_app_en: response.data?.client_app_info?.about_app_en,
        about_app_ar:response.data?.client_app_info?.about_app_ar,
      })
     
      this.files = response.data;
      this.loading = false;
    },(err:any)=>{
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
        this.showClientAppFiles();
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
        this.showClientAppFiles();
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
        this.showClientAppFiles();
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
 
  editTerms() {
    // Fetch existing content if available
    if (this.files?.client_app_info?.terms_conditions_path) {
      // In a real scenario, you might want to fetch the text content from the file
      // For now, we'll clear the path and allow editing
      this.files.client_app_info.terms_conditions_path = null;
      this.isEditingTerms = true;
    }
  }

  editAbout() {
    if (this.files?.client_app_info?.about_app_path) {
      this.files.client_app_info.about_app_path = null;
      this.isEditingAbout = true;
    }
  }

  openDeleteModal(
    type: any,
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    var dialogRef = this.dialog.open(DeletePopupComponent, {
      ...smallpopup,
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: type === 'terms' ? 'Terms & Conditions' : 'About the App',
        desc: 'Are you sure you want to delete this content?',
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (type == 'terms') {
          this.DeleteTerms(null);
        } else if (type == 'about') {
          this.DeleteAbout(null);
        }
      }
    });
  }

  DeleteTerms(val: any) {
    let form = {
      terms_conditions: val,
      type: 'client',
    };
    this.service.setfile(form).subscribe(
      (res: any) => {
        if (res.status == true) {
          this.toast.success(
            'Terms & Conditions deleted successfully!',
            'Success',
            {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            }
          );
          this.showClientAppFiles();
          this.isEditingTerms = false;
          this.termsContent = '';
        } else {
          this.toast.error(res.message, 'Error');
        }
      },
      (err: any) => {
        this.toast.error(err.error.errors[0], 'Error');
      }
    );
  }

  DeleteAbout(val: any) {
    let form = {
      about_app: val,
      type: 'client',
    };
    this.service.setfile(form).subscribe(
      (res: any) => {
        if (res.status == true) {
          this.toast.success('About the app deleted successfully!', 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
          this.showClientAppFiles();
          this.isEditingAbout = false;
          this.aboutContent = '';
        } else {
          this.toast.error(res.message, 'Error');
        }
      },
      (err: any) => {
        this.toast.error(err.error.errors[0], 'Error');
      }
    );
  }

  AddContact(
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
        this.showClientAppFiles();
      }
    });
  }

  
}


// implements OnInit {
//   loading: boolean = true;
//   files: any;
//   termsContent: string = '';
//   aboutContent: string = '';
//   isEditingTerms: boolean = false;
//   isEditingAbout: boolean = false;

//   constructor(
//     private service: AppService,
//     private toast: ToastrService,
//     private dialog: MatDialog,
//     private spinner: NgxSpinnerService
//   ) {}

//   ngOnInit(): void {
//     this.showCats();
//   }

//   showCats() {
//     this.loading = true;
//     this.service.appInfo().subscribe((response: any) => {
//       console.log(response.data);
//       this.termsContent = response.data?.client_app_info?.terms_conditions;
//       this.aboutContent = response.data?.client_app_info?.privacy_policy;
//       this.files = response.data;
//       this.loading = false;
//     });
//   }

//   saveTerms() {
//     if (!this.termsContent?.trim()) {
//       this.toast.warning('Please enter Terms & Conditions content', 'Warning');
//       return;
//     }

//     this.spinner.show();
//     const form = {
//       terms_conditions: this.termsContent,
//       type: 'client',
//     };
//     this.service.setfile(form).subscribe(
//       (setRes: any) => {
//         this.spinner.hide();
//         if (setRes.status == true) {
//           this.toast.success(
//             'Terms & Conditions saved successfully!',
//             'Success',
//             {
//               timeOut: 3000,
//               positionClass: 'toast-top-right',
//             }
//           );
//           this.showCats();
//           this.termsContent = '';
//         } else {
//           this.toast.error(setRes.message, 'Error');
//         }
//       },
//       (setErr: any) => {
//         this.spinner.hide();
//         this.toast.error(setErr.error.errors[0], 'Error');
//       }
//     );

//     // // Create a text file from the content
//     // const blob = new Blob([this.termsContent], { type: 'text/plain' });
//     // const file = new File([blob], 'terms_and_conditions.txt', {
//     //   type: 'text/plain',
//     // });

//     // this.cats.uploadFiles([file]).subscribe(
//     //   (res: any) => {
//     //     this.spinner.hide();
//     //     if (res.status == true) {
//     //       let form = {
//     //         terms_conditions: res.data[0],
//     //         type: 'client',
//     //       };
//     //       this.cats.setfile(form).subscribe(
//     //         (setRes: any) => {
//     //           if (setRes.status == true) {
//     //             this.toast.success(
//     //               'Terms & Conditions saved successfully!',
//     //               'Success',
//     //               {
//     //                 timeOut: 3000,
//     //                 positionClass: 'toast-top-right',
//     //               }
//     //             );
//     //             this.showCats();
//     //             this.termsContent = '';
//     //           } else {
//     //             this.toast.error(setRes.message, 'Error');
//     //           }
//     //         },
//     //         (setErr: any) => {
//     //           this.toast.error(setErr.error.errors[0], 'Error');
//     //         }
//     //       );
//     //     } else {
//     //       this.toast.error(res?.errors[0], 'Error');
//     //     }
//     //   },
//     //   (err: any) => {
//     //     this.spinner.hide();
//     //     this.toast.error(err.error.errors[0], 'Error');
//     //   }
//     // );
//   }

//   saveAbout() {
//     if (!this.aboutContent?.trim()) {
//       this.toast.warning('Please enter About the app content', 'Warning');
//       return;
//     }

//     this.spinner.show();
//     const form = {
//       privacy_policy: this.aboutContent,
//       type: 'client',
//     };
//     this.service.setfile(form).subscribe(
//       (setRes: any) => {
//         this.spinner.hide();
//         if (setRes.status == true) {
//           this.toast.success('About the app saved successfully!', 'Success', {
//             timeOut: 3000,
//             positionClass: 'toast-top-right',
//           });
//           this.showCats();
//           this.aboutContent = '';
//         } else {
//           this.toast.error(setRes.message, 'Error');
//         }
//       },
//       (setErr: any) => {
//         this.spinner.hide();
//         this.toast.error(setErr.error.errors[0], 'Error');
//       }
//     );
//     // Create a text file from the content
//     // const blob = new Blob([this.aboutContent], { type: 'text/plain' });
//     // const file = new File([blob], 'about_the_app.txt', { type: 'text/plain' });

//     // this.cats.uploadFiles([file]).subscribe(
//     //   (res: any) => {
//     //     this.spinner.hide();
//     //     if (res.status == true) {
//     //       let form = {
//     //         about_app: res.data[0],
//     //         type: 'client',
//     //       };
//     //       this.cats.setfile(form).subscribe(
//     //         (setRes: any) => {
//     //           if (setRes.status == true) {
//     //             this.toast.success(
//     //               'About the app saved successfully!',
//     //               'Success',
//     //               {
//     //                 timeOut: 3000,
//     //                 positionClass: 'toast-top-right',
//     //               }
//     //             );
//     //             this.showCats();
//     //             this.aboutContent = '';
//     //           } else {
//     //             this.toast.error(setRes.message, 'Error');
//     //           }
//     //         },
//     //         (setErr: any) => {
//     //           this.toast.error(setErr.error.errors[0], 'Error');
//     //         }
//     //       );
//     //     } else {
//     //       this.toast.error(res?.errors[0], 'Error');
//     //     }
//     //   },
//     //   (err: any) => {
//     //     this.spinner.hide();
//     //     this.toast.error(err.error.errors[0], 'Error');
//     //   }
//     // );
//   }

//   editTerms() {
//     // Fetch existing content if available
//     if (this.files?.client_app_info?.terms_conditions_path) {
//       // In a real scenario, you might want to fetch the text content from the file
//       // For now, we'll clear the path and allow editing
//       this.files.client_app_info.terms_conditions_path = null;
//       this.isEditingTerms = true;
//     }
//   }

//   editAbout() {
//     if (this.files?.client_app_info?.about_app_path) {
//       this.files.client_app_info.about_app_path = null;
//       this.isEditingAbout = true;
//     }
//   }

//   openDeleteModal(
//     type: any,
//     enterAnimationDuration: string,
//     exitAnimationDuration: string
//   ) {
//     var dialogRef = this.dialog.open(DeletePopupComponent, {
//       ...smallpopup,
//       enterAnimationDuration,
//       exitAnimationDuration,
//       data: {
//         title: type === 'terms' ? 'Terms & Conditions' : 'About the App',
//         desc: 'Are you sure you want to delete this content?',
//       },
//     });
//     dialogRef.afterClosed().subscribe((result: any) => {
//       if (result) {
//         if (type == 'terms') {
//           this.DeleteTerms(null);
//         } else if (type == 'about') {
//           this.DeleteAbout(null);
//         }
//       }
//     });
//   }

//   DeleteTerms(val: any) {
//     let form = {
//       terms_conditions: val,
//       type: 'client',
//     };
//     this.service.setfile(form).subscribe(
//       (res: any) => {
//         if (res.status == true) {
//           this.toast.success(
//             'Terms & Conditions deleted successfully!',
//             'Success',
//             {
//               timeOut: 3000,
//               positionClass: 'toast-top-right',
//             }
//           );
//           this.showCats();
//           this.isEditingTerms = false;
//           this.termsContent = '';
//         } else {
//           this.toast.error(res.message, 'Error');
//         }
//       },
//       (err: any) => {
//         this.toast.error(err.error.errors[0], 'Error');
//       }
//     );
//   }

//   DeleteAbout(val: any) {
//     let form = {
//       about_app: val,
//       type: 'client',
//     };
//     this.service.setfile(form).subscribe(
//       (res: any) => {
//         if (res.status == true) {
//           this.toast.success('About the app deleted successfully!', 'Success', {
//             timeOut: 3000,
//             positionClass: 'toast-top-right',
//           });
//           this.showCats();
//           this.isEditingAbout = false;
//           this.aboutContent = '';
//         } else {
//           this.toast.error(res.message, 'Error');
//         }
//       },
//       (err: any) => {
//         this.toast.error(err.error.errors[0], 'Error');
//       }
//     );
//   }

//   AddContact(
//     item: any,
//     enterAnimationDuration: string,
//     exitAnimationDuration: string
//   ) {
//     var dialogRef = this.dialog.open(AddComponent, {
//       ...largepopup,
//       enterAnimationDuration,
//       exitAnimationDuration,
//       data: {
//         item: item,
//       },
//     });
//     dialogRef.afterClosed().subscribe((result: any) => {
//       if (result) {
//         this.toast.success(
//           'Contact information updated successfully!',
//           'Success',
//           {
//             timeOut: 3000,
//             positionClass: 'toast-top-right',
//           }
//         );
//         this.showCats();
//       }
//     });
//   }
// }
