import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-delete-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-popup.component.html',
  styleUrl: './delete-popup.component.scss'
})
export class DeletePopupComponent {
  title:any;
 

  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DeletePopupComponent>){
    console.log(data);
    
  }
 
  ngOnInit(){
  }
  close(){
    this.dialogRef.close()
  }
  delete_item(){
    this.dialogRef.close(true)
  }
 
}