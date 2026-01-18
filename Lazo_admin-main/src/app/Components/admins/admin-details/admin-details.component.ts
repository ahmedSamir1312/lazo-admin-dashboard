import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-admin-details',
  standalone: true,
  imports: [],
  templateUrl: './admin-details.component.html',
  styleUrl: './admin-details.component.scss'
})
export class AdminDetailsComponent  implements OnInit {
  user: any;
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
public dialogRef: MatDialogRef<AdminDetailsComponent>){
  console.log(data);
  
}
  ngOnInit(): void {
   this.user=this.data.item;
  }
  close(){
    this.dialogRef.close()
  }

}
