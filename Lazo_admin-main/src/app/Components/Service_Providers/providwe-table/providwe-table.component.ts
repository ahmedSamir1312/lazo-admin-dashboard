import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AppService } from '../../../services/app.service';
import { PalceholderTableComponent } from '../../../Shared/palceholder-table/palceholder-table.component';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastrService } from 'ngx-toastr';
import { SearchPipe } from '../../../Pipes/search.pipe';
import { DeletePopupComponent } from '../../../Shared/delete-popup/delete-popup.component';
import { smallpopup } from '../../../Shared/configration';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-providwe-table',
  standalone: true,
  imports: [
    PalceholderTableComponent,
    CommonModule,
    InfiniteScrollModule,
    RouterModule,
    MatSlideToggleModule,
    SearchPipe,
  ],
  templateUrl: './providwe-table.component.html',
  styleUrl: './providwe-table.component.scss',
})
export class ProvidweTableComponent implements OnInit, OnChanges {
  @Input() data: any;
  total_pages: any = 0;
  page: any = 1;
  loading: boolean = true;
  details: any = [];
  header: any;
  type: any;
  account_type: any;
  receivedData: any;
  constructor(
    private provider: AppService,
    private toast: ToastrService,
    private dialog: MatDialog
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.header = changes['data'].currentValue[0].header;
    this.type = changes['data'].currentValue[0].type;
    this.account_type = changes['data'].currentValue[0].family;
    this.loading = true;
    this.showTaps(this.type, this.account_type, this.page);
  }
  ngOnInit(): void {
    this.provider.search$.subscribe((data: any) => {
      console.log(data);

      this.receivedData = data;
    });
  }
  onScroll(event: any) {
    console.log(this.total_pages);
    if (this.page != undefined) {
      if (this.total_pages > this.page) {
        this.page = this.page + 1;
        console.log(this.page);

        this.showTaps(this.type, this.account_type, this.page);
      }
    }
  }
  showTaps(status: any, account_type: any, page: any): void {
    this.provider
      .getProviders(status, account_type, page)
      .subscribe((stats: any) => {
        console.log(stats.data.data);
        this.total_pages = stats.data.last_page;
        this.details.push(...stats.data.data);
        this.loading = false;
      });
  }
  toggle(item: any, status: any) {
    this.provider
      .toggleProvider({ provider_id: item.id, status: status })
      .subscribe((res: any) => {
        this.toast.success('', res.message, {
          closeButton: true,
          tapToDismiss: true,
          disableTimeOut: false,
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        });
        if (item.status == 'active') {
          item.status = 'blocked';
        } else if (item.status == 'blocked') {
          item.status = 'active';
        }
      });
  }
  togglepromoted(item: any) {
    if (item.is_promoted == '1') {
      item.is_promoted = '0';
    } else if (item.is_promoted == '0') {
      item.is_promoted = '1';
    }
    this.provider
      .toggleProviderPromoted({
        provider_id: item.id,
        is_promoted: item.is_promoted,
      })
      .subscribe((res: any) => {
        this.toast.success('', res.message, {
          closeButton: true,
          tapToDismiss: true,
          disableTimeOut: false,
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        });
      });
  }
  openDeleteModal(
    item: any,
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    var dialogRef = this.dialog.open(DeletePopupComponent, {
      ...smallpopup,
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: item.name,
        desc: 'Delete Provider',
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.toggle(item, 'deleted');
        this.details.splice(this.details.indexOf(item), 1);
      }
    });
  }
}
