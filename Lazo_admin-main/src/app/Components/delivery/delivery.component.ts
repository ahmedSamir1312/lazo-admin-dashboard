import { Component, OnInit, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { TableComponent } from './table/table.component';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from './add/add.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [MatTabsModule, CommonModule, TableComponent],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss',
})
export class DeliveryComponent {
  matTabGroup: any;
  loading: boolean = true;
  type: any = 'Time';
  details: any;
  order_family: any;
  timeHeader: any = [
    'No.',
    'From',
    'To',
    'Created at',
    'Include current day',
    'Action',
  ];
  feesHeader: any = ['No.', 'Created at', 'Ammount', 'Action'];
  title = signal<string>('Delivery Time');
  refreshCounter = 0;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toaster: ToastrService
  ) {}
  ngOnInit(): void {}
  resetShowItem(event: any) {
    this.type = event.tab.textLabel;
    console.log(this.type);
  }
  add() {
    this.dialog
      .open(AddComponent, {
        data: { type: this.type },
      })
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.toaster.success(result, 'Success');
          this.refreshCounter++;
          this.resetShowItem({ tab: { textLabel: this.type } });
        }
      });
  }
}
