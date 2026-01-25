import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Location } from '@angular/common';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { CancelReasonComponent } from '../cancel-reason/cancel-reason.component';
import { largepopup } from '../../../Shared/configration';
import { MatDialog } from '@angular/material/dialog';
import { DateTimeComponent } from '../date-time/date-time.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
})
export class OrderDetailsComponent {
  order: any;
  receiver_address: any = '';
  constructor(
    private location: Location,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private orders: AppService,
    private toastr: ToastrService
  ) {
    this.activatedRoute.data.subscribe((data: any) => {
      this.order = data.order.data;
    });
    console.log(this.order?.providers_items, 'order details');
  }

  manageOrders(status: any): void {
    let form = {};
    if (this.order.status_id >= 2 && this.order.status_id <= 4) {
      form = {
        delivery_date: this.order.delivery_date,
        delivery_time: this.order.delivery_time,
        order_id: this.order.id,
        packaging_provider_id: this.order?.packaging_provider_id,
        status_id: status,
      };
      if (
        this.order?.packaging_provider_id == null &&
        this.order?.order_family == 'collective'
      ) {
        this.toastr.error('Please select a packaging provider', 'erorr', {
          tapToDismiss: true,
          disableTimeOut: false,
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        });
        return;
      }
    } else {
      form = {
        order_id: this.order.id,
        status_id: status,
      };
    }

    this.orders.manageOrders(form).subscribe((res: any) => {
      this.order.status_id = res?.data.status_id;
      this.order.status = res?.data.status;
      this.order.finished_at = res?.data.finished_at;
     if(res?.status) {
       this.toastr.success(res?.message, 'success', {
        tapToDismiss: true,
        disableTimeOut: false,
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
     }else{
       this.toastr.error(res?.message, 'fail', {
        tapToDismiss: true,
        disableTimeOut: false,
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
     }
    },(err:any)=>{
     // console.log("message",err?.error?.message)
        this.toastr.error(err?.error?.message, 'fail', {
        tapToDismiss: true,
        disableTimeOut: false,
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    });
  }

  edit_date(enterAnimationDuration: string, exitAnimationDuration: string) {
    var dialogRef = this.dialog.open(DateTimeComponent, {
      ...largepopup,
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        item: this.order,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.order = result;
      }
    });
  }

  cancel_order(enterAnimationDuration: string, exitAnimationDuration: string) {
    var dialogRef = this.dialog.open(CancelReasonComponent, {
      ...largepopup,
      enterAnimationDuration,
      exitAnimationDuration,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.close == true) {
        let form = {
          cancellation_reason: result.reason,
          order_id: this.order.id,
          status_id: this.order.order_family == 'ready_made' ? 10 : 11,
        };
        this.orders.manageOrders(form).subscribe((res: any) => {
          this.order.status_id = res?.data.status_id;
          this.order.status = res?.data.status;
          this.order.cancelled_at = res?.data.cancelled_at;
          this.order.cancelled_by = res?.data.cancelled_by;

          this.toastr.success(res.message, 'success', {
            tapToDismiss: true,
            disableTimeOut: false,
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
          });
        });
      }
    });
  }

  accept_order(status: any) {
    if (this.receiver_address == '') {
      this.toastr.error('location is required', 'error');
      return;
    }
    let form = {
      delivery_date: this.order.delivery_date,
      delivery_time: this.order.delivery_time,
      receiver_address: this.receiver_address,
      order_id: this.order.id,
      packaging_provider_id: this.order?.packaging_provider_id,
      status_id: status,
    };
    this.orders.manageOrders(form).subscribe((res: any) => {
      this.order.status_id = res?.data.status_id;
      this.order.status = res?.data.status;
      this.order.finished_at = res?.data.finished_at;
      this.order.receiver_address = res?.data.receiver_address;
      this.toastr.success(res.message, 'success', {
        tapToDismiss: true,
        disableTimeOut: false,
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    },(err:any)=>{
        this.toastr.error(err?.error?.message, 'fail', {
        tapToDismiss: true,
        disableTimeOut: false,
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    });
  }

  goBack() {
    this.location.back();
  }
}
