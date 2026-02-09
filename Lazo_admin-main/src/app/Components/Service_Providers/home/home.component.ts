import { AppService } from './../../../services/app.service';
import { Component, OnDestroy, TemplateRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
// import { TableComponent } from '../../Ready_orders/table/table.component';
import { ProvidweTableComponent } from '../providwe-table/providwe-table.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
// import { PalceholderTableComponent } from '../../../Shared/palceholder-table/palceholder-table.component';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgSelectModule, } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    ProvidweTableComponent,
    MatTabsModule,
    CommonModule,
    // PalceholderTableComponent,
    RouterModule,
    NgSelectModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy {
  matTabGroup: any;
  title: any;
  type: any = 'active';
  package_providers_list:any[]=[];
  account_type: any;
  selectedPackageIds:any;
  header: any = [
    'No.',
    'Store Name',
    'Provider’s Name',
    'New Orders',
    'Current Orders',
    'Finished Orders',
    'Active',
    'Block',
    'Action',
  ];

  main_header: any = [
    'No.',
    'Store Name',
    'Provider’s Name',
    'City',
    'Phone',
    'Business Type',
    'Service Type',
    'Action',
  ];

  block_header: any = [
    'No.',
    'Store Name',
    'Provider’s Name',
    'City',
    'Phone',
    'Business Type',
    'Service Type',
    'Block',
    'Action',
  ];

  search: any = '';
  modalRef?: BsModalRef;
  
  constructor(private route: ActivatedRoute, private toastr:ToastrService,private AppService: AppService , private modalService: BsModalService) {
    this.route.data.subscribe((data) => {
      this.account_type = data['account_type'];
      this.title = data['title'];
      this.account_type == 'service_provider'
        ? (this.header = [
            'No.',
            'Store Name',
            'Provider’s Name',
            'New Orders',
            'Current Orders',
            'Finished Orders',
            'Active',
            'Block',
            'promote',
            'Action',
          ])
        : this.header;
      console.log(this.account_type, this.title);
    });

    this.getDefaultPackageProvider();
    console.log("this.account_type",this.account_type == 'Packaging Providers')
  }

  showTabs(status: any, account_type: any, page: any): void {
    this.AppService
      .getProviders(status, account_type, page)
      .subscribe((stats: any) => {
        console.log(stats.data.data);
        this.package_providers_list = stats?.data?.data;
        // this.total_pages = stats.data.last_page;
        // this.details.push(...stats.data.data);
        // this.loading = false;
      });
  }

  closeModal() {
    this.modalRef?.hide();
  }

  resetShowItem(event: any) {
    switch (event.tab.textLabel) {
      case 'Active Providers':
        this.type = 'active';
        break;

      case 'Blocked Accounts':
        this.type = 'blocked';
        break;

      case 'Joining Requests':
        this.type = 'pending';
        break;
      case 'Deleted Accounts':
        this.type = 'deleted';
        break;
      default:
        this.type = 'active'; // قيمة افتراضية إذا لم تتطابق التسمية
        break;
    }
    console.log(this.type);
  }

  sendData(event: any) {
    this.AppService.updateData(event.target.value);
  }

  ngOnDestroy(): void {
    this.AppService.updateData('');
  }

  getDefaultPackageProvider() {
    this.AppService.getPackageProviderAsDefault().subscribe((res:any)=>{
      // console.log("getDefaultPackageProvider",res?.data)
      this.selectedPackageIds = res?.data[0]?.id
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.showTabs('active',this.account_type,1)
  }

  SaveDefultPackageProvider(){
    // console.log("selectedPackageIds" ,this.selectedPackageIds)
    if(this.selectedPackageIds) {
      this.AppService.setPackageProviderAsDefault(this.selectedPackageIds).subscribe((res:any)=>{
        if(res?.status){ 
        this.toastr.success(res?.message, 'Success') 
         this.modalService.hide();
        }
      },(err:any)=>{
        this.toastr.error(err.error.errors?.provider_id[0], 'Error')
      }) 
    }else{
      this.toastr.error('You Have To Select Package Provider', 'Error')
    }
  }

}
