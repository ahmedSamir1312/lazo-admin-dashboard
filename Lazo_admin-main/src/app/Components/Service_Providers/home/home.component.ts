import { AppService } from './../../../services/app.service';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
// import { TableComponent } from '../../Ready_orders/table/table.component';
import { ProvidweTableComponent } from '../providwe-table/providwe-table.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
// import { PalceholderTableComponent } from '../../../Shared/palceholder-table/palceholder-table.component';
import { FormsModule } from '@angular/forms';

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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy {
  matTabGroup: any;
  title: any;
  type: any = 'active';
  account_type: any;
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
  constructor(private route: ActivatedRoute, private AppService: AppService) {
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
}
