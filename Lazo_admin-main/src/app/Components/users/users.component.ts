import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ToastrService } from 'ngx-toastr';
import { PalceholderTableComponent } from '../../Shared/palceholder-table/palceholder-table.component';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    InfiniteScrollModule,
    PalceholderTableComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  loading: boolean = true;
  total_pages: any = 0;
  page: any = 1;
  header: any = [
    'No.',
    'User Name',
    'Email',
    'Phone Number',
    'City',
    'Finished Orders',
    'Current Orders',
    'Block',
  ];

  Users: any = [];
  constructor(private user: AppService, private toast: ToastrService) {}
  ngOnInit(): void {
    this.showUsers();
  }
  showUsers() {
    this.user.users(this.page).subscribe((stats: any) => {
      console.log(stats.data.data);
      this.total_pages = stats.data.last_page;
      this.Users.push(...stats.data.data);
      this.loading = false;
    });
  }
  onScroll(event: any) {
    console.log(this.total_pages);
    if (this.page != undefined) {
      if (this.total_pages > this.page) {
        this.page = this.page + 1;
        console.log(this.page);
        this.showUsers();
      }
    }
  }
  toggle(item: any) {
    this.user
      .blockedUsers({
        user_id: item.id,
        status: item.status == 'active' ? 'block' : 'unblock',
      })
      .subscribe((res: any) => {
        this.toast.success('', res.message, {
          closeButton: true,
          tapToDismiss: true,
          disableTimeOut: false,
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        });
        item.status = !item.status;
      });
  }
}
