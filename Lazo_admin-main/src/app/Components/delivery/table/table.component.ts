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
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { RouterModule } from '@angular/router';
import { DeletePopupComponent } from '../../../Shared/delete-popup/delete-popup.component';
import { smallpopup } from '../../../Shared/configration';
import { MatDialog } from '@angular/material/dialog';
import { UpdateComponent } from '../update/update.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    PalceholderTableComponent,
    CommonModule,
    InfiniteScrollDirective,
    RouterModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() refreshTrigger: number = 0; // Add this input

  total_pages: any = 0;
  page: any = 1;
  loading: boolean = true;
  details: any = [];
  header: any;
  type: any;
  family: any;

  constructor(
    private order: AppService,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes detected:', changes);
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      console.log('Refresh triggered, reloading data');
      this.refreshData();
    }
    if (changes['data']) {
      this.header = changes['data'].currentValue[0].header;
      this.type = changes['data'].currentValue[0].type;
      this.family = changes['data'].currentValue[0].family;
      this.loading = true;
      this.details = []; // Clear existing data
      this.page = 1; // Reset to first page
      this.showTaps(this.type, this.family, this.page);
    }
  }

  refreshData(): void {
    this.loading = true;
    this.details = []; // Clear existing data
    this.page = 1; // Reset to first page
    this.showTaps(this.type, this.family, this.page);
  }

  ngOnInit(): void {
    console.log(this.data);
    console.log(this.type, 'this.type');
  }
  onScroll() {
    console.log('Scrolling');
    if (this.page != undefined) {
      if (this.total_pages > this.page) {
        this.page = this.page + 1;
        console.log(this.page);
        this.showTaps(this.type, this.family, this.page);
      }
    }
  }
  editDeliveryItem(item: any, index: number) {
    this.dialog
      .open(UpdateComponent, {
        data: {
          item: item,
          type: this.type,
        },
      })
      .afterClosed()
      .subscribe((result: any) => {
        console.log(result);
        if (result) {
          this.toast.success(result?.message, 'Success');
          this.details[index] = result?.data;
        }
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
        title: item.name_en,
        desc: 'Delete Occasion',
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteDeliveryItem(item.id);
      }
    });
  }
  deleteDeliveryItem(id: any) {
    this.order.deleteDelevery(id).subscribe((res: any) => {
      this.toast.success(res?.message, 'Success');
      this.details.splice(this.details.indexOf(id), 1);
    });
  }
  showTaps(status: any, family: any, page: any): void {
    if (this.type == 'Time') {
      this.order.loadDeliveryData().subscribe((stats: any) => {
        console.log(stats?.data);
        this.total_pages = stats?.last_page;
        this.details.push(...stats.data);
        this.loading = false;
      });
    } else if (this.type == 'Fees') {
      this.order.loadDeliveryFees().subscribe((stats: any) => {
        console.log(stats?.data);
        this.total_pages = stats?.last_page;
        this.details.push(...stats.data);
        this.loading = false;
      });
    }
  }
}
