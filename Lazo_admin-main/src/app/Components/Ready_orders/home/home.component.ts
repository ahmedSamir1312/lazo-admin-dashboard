import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PalceholderTableComponent } from '../../../Shared/palceholder-table/palceholder-table.component';
import { TableComponent } from '../table/table.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AppService } from '../../../services/app.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatTabsModule, CommonModule, TableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  matTabGroup: any;
  loading: boolean = true;
  type: any = 'new';
  details: any;
  order_family: any;
  header: any = [
    'No.',
    'Order ID',
    'Order Type',
    'No. of items',
    'Total Price',
    'Placed Date / Time',
    'Status',
    'Action',
  ];
  title: any;
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data) => {
      this.order_family = data['order_family'];
      this.title = data['title'];
    });
  }
  ngOnInit(): void {}
  resetShowItem(event: any) {
    this.type = event.tab.textLabel;
    console.log(this.type);
  }
}
