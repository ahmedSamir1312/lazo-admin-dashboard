import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { PalceholderTableComponent } from '../../../Shared/palceholder-table/palceholder-table.component';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SearchPipe } from "../../../Pipes/search.pipe";
import { TransactionsPopupComponent } from '../transactions-popup/transactions-popup.component';
import { largepopup } from '../../../Shared/configration';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [PalceholderTableComponent, CommonModule, InfiniteScrollModule, SearchPipe],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
  @Input() provider_id: any;
  total_pages:any=0;
  page:any=1;
  loading:boolean=true;
  details: any=[];
  header: any = [
    'No.',
    'Order ID',
    'Sender Name',
    'receipt',
    'Date / Time',
    'Amount',
   
  ];
  receivedData: any;
  current_balance: any;
  constructor(private provider:AppService ,private toast:ToastrService ,private dialog:MatDialog){}

  ngOnInit(): void {
    this.provider.search$.subscribe((data: any) => {
      console.log(data);
      
      this.receivedData = data;
    });
    this.provider.reload$.subscribe((data: any) => {
     
     if(data==true){
      this.details=[]
      console.log(this.provider_id , data);
      
      this.showTaps(this.provider_id, this.page)
     }
    });
    this.showTaps(this.provider_id, this.page)
  }
  showTaps(provider_id:any ,page:any): void {
 
    this.loading=true

    this.provider.show_provider_transactions(provider_id, page).subscribe((stats:any) =>{
      this.current_balance=stats?.data.current_balance
    
          this.total_pages=stats.data.transactions?.last_page
          console.log(stats.data.transactions?.data , this.total_pages);
          this.details.push(...stats.data.transactions?.data )
          this.loading=false
        })
  }
  onScroll(event:any){
    console.log(this.total_pages);
  if(this.page !=undefined){
    if(this.total_pages> this.page ){
      this.page=this.page+1;
      console.log(this.page);
  
      this.showTaps(this.provider_id, this.page)
    }
  }}
  make_transactions( enterAnimationDuration: string, exitAnimationDuration: string) {
    var dialogRef = this.dialog.open(TransactionsPopupComponent, {...largepopup ,  enterAnimationDuration,
      exitAnimationDuration,data:{
        provider_id: this.provider_id,
       
      }});
    dialogRef.afterClosed().subscribe((result:any) => {
  if(result){
    this.details=[]
    this.showTaps(this.provider_id, 1)
  }
  
    });
  }
  sendData(event:any) {
    this.provider.updateData(event.target.value);
  }
  ngOnDestroy(): void {
    this.provider.updateData('');
  }
}
