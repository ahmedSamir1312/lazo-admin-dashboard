import { Component, OnInit } from '@angular/core';
import { PalceholderTableComponent } from '../../../Shared/palceholder-table/palceholder-table.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../Shared/delete-popup/delete-popup.component';
import { largepopup, smallpopup } from '../../../Shared/configration';
import { AddComponent } from '../add/add.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PalceholderTableComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  loading: boolean = true;
  files: any;
  termsContent: string = '';
  aboutContent: string = '';
  isEditingTerms: boolean = false;
  isEditingAbout: boolean = false;

  constructor(
    private cats: AppService,
    private toast: ToastrService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.showCats();
  }

  showCats() {
    this.loading = true;
    this.cats.clintsfils().subscribe((stats: any) => {
      console.log(stats.data);
      this.termsContent = stats.data?.client_app_info?.terms_conditions;
      this.aboutContent = stats.data?.client_app_info?.privacy_policy;
      this.files = stats.data;
      this.loading = false;
    });
  }

  saveTerms() {
    if (!this.termsContent.trim()) {
      this.toast.warning('Please enter Terms & Conditions content', 'Warning');
      return;
    }

    this.spinner.show();
    const form = {
      terms_conditions: this.termsContent,
      type: 'client',
    };
    this.cats.setfile(form).subscribe(
      (setRes: any) => {
        this.spinner.hide();
        if (setRes.status == true) {
          this.toast.success(
            'Terms & Conditions saved successfully!',
            'Success',
            {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            }
          );
          this.showCats();
          this.termsContent = '';
        } else {
          this.toast.error(setRes.message, 'Error');
        }
      },
      (setErr: any) => {
        this.spinner.hide();
        this.toast.error(setErr.error.errors[0], 'Error');
      }
    );

    // // Create a text file from the content
    // const blob = new Blob([this.termsContent], { type: 'text/plain' });
    // const file = new File([blob], 'terms_and_conditions.txt', {
    //   type: 'text/plain',
    // });

    // this.cats.uploadFiles([file]).subscribe(
    //   (res: any) => {
    //     this.spinner.hide();
    //     if (res.status == true) {
    //       let form = {
    //         terms_conditions: res.data[0],
    //         type: 'client',
    //       };
    //       this.cats.setfile(form).subscribe(
    //         (setRes: any) => {
    //           if (setRes.status == true) {
    //             this.toast.success(
    //               'Terms & Conditions saved successfully!',
    //               'Success',
    //               {
    //                 timeOut: 3000,
    //                 positionClass: 'toast-top-right',
    //               }
    //             );
    //             this.showCats();
    //             this.termsContent = '';
    //           } else {
    //             this.toast.error(setRes.message, 'Error');
    //           }
    //         },
    //         (setErr: any) => {
    //           this.toast.error(setErr.error.errors[0], 'Error');
    //         }
    //       );
    //     } else {
    //       this.toast.error(res?.errors[0], 'Error');
    //     }
    //   },
    //   (err: any) => {
    //     this.spinner.hide();
    //     this.toast.error(err.error.errors[0], 'Error');
    //   }
    // );
  }

  saveAbout() {
    if (!this.aboutContent.trim()) {
      this.toast.warning('Please enter About the app content', 'Warning');
      return;
    }

    this.spinner.show();
    const form = {
      privacy_policy: this.aboutContent,
      type: 'client',
    };
    this.cats.setfile(form).subscribe(
      (setRes: any) => {
        this.spinner.hide();
        if (setRes.status == true) {
          this.toast.success('About the app saved successfully!', 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
          this.showCats();
          this.aboutContent = '';
        } else {
          this.toast.error(setRes.message, 'Error');
        }
      },
      (setErr: any) => {
        this.spinner.hide();
        this.toast.error(setErr.error.errors[0], 'Error');
      }
    );
    // Create a text file from the content
    // const blob = new Blob([this.aboutContent], { type: 'text/plain' });
    // const file = new File([blob], 'about_the_app.txt', { type: 'text/plain' });

    // this.cats.uploadFiles([file]).subscribe(
    //   (res: any) => {
    //     this.spinner.hide();
    //     if (res.status == true) {
    //       let form = {
    //         about_app: res.data[0],
    //         type: 'client',
    //       };
    //       this.cats.setfile(form).subscribe(
    //         (setRes: any) => {
    //           if (setRes.status == true) {
    //             this.toast.success(
    //               'About the app saved successfully!',
    //               'Success',
    //               {
    //                 timeOut: 3000,
    //                 positionClass: 'toast-top-right',
    //               }
    //             );
    //             this.showCats();
    //             this.aboutContent = '';
    //           } else {
    //             this.toast.error(setRes.message, 'Error');
    //           }
    //         },
    //         (setErr: any) => {
    //           this.toast.error(setErr.error.errors[0], 'Error');
    //         }
    //       );
    //     } else {
    //       this.toast.error(res?.errors[0], 'Error');
    //     }
    //   },
    //   (err: any) => {
    //     this.spinner.hide();
    //     this.toast.error(err.error.errors[0], 'Error');
    //   }
    // );
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
    this.cats.setfile(form).subscribe(
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
          this.showCats();
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
    this.cats.setfile(form).subscribe(
      (res: any) => {
        if (res.status == true) {
          this.toast.success('About the app deleted successfully!', 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
          this.showCats();
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
        this.showCats();
      }
    });
  }
}
