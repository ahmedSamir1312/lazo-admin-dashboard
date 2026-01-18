import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { AppService } from '../../../services/app.service';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatMenuModule,
    MatRadioModule,
    MatTabsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    NgSelectModule,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  setCourseId(_t14: any) {
    throw new Error('Method not implemented.');
  }
  form!: FormGroup;
  statusLabel: any;
  statusIndex: any;
  count = 0;
  matTabGroup!: any;
  items: any = ['new', 'current', 'finished', 'cancelled'];
  toggleLength: boolean = false;

  isOpened = { isHovered: false };
  Statistics: any;
  lodstat: boolean = true;
  selectedDate: any = 'last week';

  dates = [
    { id: 1, name: 'Last Week' },
    { id: 2, name: 'Last Month' },
    { id: 3, name: 'Last 3 Month' },
    { id: 4, name: 'Last Year' },
  ];
  courses: any;
  constructor(private formbuilder: FormBuilder, private app: AppService) {
    this.form = this.formbuilder.group({
      date: new FormControl(null),
      sort_by_date: new FormControl(null),
      statusGroup: new FormGroup({
        date: new FormControl(null),
      }),

      sortGroup: new FormGroup({
        sort_by_date: new FormControl(null),
      }),
    });

    if (sessionStorage.getItem('status')) {
      this.matTabGroup = sessionStorage.getItem('status')?.toString();
    }
  }
  ngOnInit(): void {
    this.showStats('last_week');
  }
  showStats(name: any) {
    this.lodstat = true;
    this.app.showStatistics(name).subscribe((stats: any) => {
      console.log(stats);
      this.Statistics = stats.data;
      this.lodstat = false;
    });
  }
  statusChange(event: any) {
    console.log('statusChange', event.value);
    event.value = event.value.replaceAll(' ', '_');
    this.showStats(event.value);
    // this.setInitiateValue()
    //filter using status
  }
}
