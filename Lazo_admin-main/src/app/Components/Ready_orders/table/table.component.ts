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
  total_pages: any = 0;
  page: any = 1;
  loading: boolean = true;
  details: any = [];
  header: any;
  type: any;
  family: any;
  constructor(private order: AppService) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.header = changes['data'].currentValue[0].header;
    this.type = changes['data'].currentValue[0].type;
    this.family = changes['data'].currentValue[0].family;
    this.loading = true;
    this.showTaps(this.type, this.family, this.page);
  }
  ngOnInit(): void {}
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
  showTaps(status: any, family: any, page: any): void {
    this.order.show_order(status, family, page, 15).subscribe((stats: any) => {
      console.log(stats.data.last_page);
      this.total_pages = stats.data.last_page;
      this.details.push(...stats.data.data);
      this.loading = false;
    });
  }
}
