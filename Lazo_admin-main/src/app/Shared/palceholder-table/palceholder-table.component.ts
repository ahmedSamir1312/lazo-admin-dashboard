import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-palceholder-table',
  standalone: true,
  imports: [],
  templateUrl: './palceholder-table.component.html',
  styleUrl: './palceholder-table.component.scss'
})
export class PalceholderTableComponent {
  @Input('header') header:any;
}
