import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { PalceholderTableComponent } from '../../../Shared/palceholder-table/palceholder-table.component';
import { TableComponent } from '../table/table.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../services/app.service';
import { AddComponent } from '../add/add.component';
import { largepopup } from '../../../Shared/configration';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatTabsModule,
    CommonModule,
    PalceholderTableComponent,
    TableComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  matTabGroup: any;
  loading: boolean = true;
  type: any = 'Cards';
  details: any;
  header: any = [
    'No.',
    'English Title',
    'Arabic Title',
    'Image',
    'Price',
    'Show',
    'Action',
  ];
  constructor(
    private cats: AppService,
    private toast: ToastrService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.showCards();
  }
  showCards() {
    this.loading = true;
    this.cats.cards().subscribe((stats: any) => {
      console.log(stats.data, 'Momen');
      this.details = stats.data;
      this.loading = false;
    });
  }
  showTaps() {
    this.loading = true;
    this.cats.taps().subscribe((stats: any) => {
      this.details = stats.data;
      this.loading = false;
    });
  }
  resetShowItem(event: any) {
    this.type = event.tab.textLabel;
    if (this.type == 'Cards') {
      this.showCards();
    } else if (this.type == 'Taps') {
      this.showTaps();
    }
  }
  addCard_Tap(enterAnimationDuration: string, exitAnimationDuration: string) {
    var dialogRef = this.dialog.open(AddComponent, {
      ...largepopup,
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        type: this.type == 'Cards' ? 'Card' : 'Tap',
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (this.type == 'Cards') {
          this.showCards();
        } else if (this.type == 'Taps') {
          this.showTaps();
        }
      }
    });
  }
}
