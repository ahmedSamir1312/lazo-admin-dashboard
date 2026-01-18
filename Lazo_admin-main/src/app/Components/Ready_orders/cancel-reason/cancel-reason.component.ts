import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-reason',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cancel-reason.component.html',
  styleUrl: './cancel-reason.component.scss'
})
export class CancelReasonComponent {
  constructor(public dialogRef: MatDialogRef<CancelReasonComponent> ){}
reason: any='';
close(){
  this.dialogRef.close({reason:this.reason , close:true})
}
}
