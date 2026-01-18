import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AppService } from '../../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { EditComponent } from '../edit/edit.component';
import { largepopup, smallpopup } from '../../../Shared/configration';
import { DeletePopupComponent } from '../../../Shared/delete-popup/delete-popup.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatSlideToggleModule, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() data: any;
  constructor(
    private cats: AppService,
    private toast: ToastrService,
    private dialog: MatDialog
  ) {}
  toggle(item: any) {
    this.cats
      .togglecard_tap(
        this.data[0].type == 'Cards' ? 'gift_card' : 'gift_box',
        item.id
      )
      .subscribe((res: any) => {
        this.toast.success('', res.message, {
          closeButton: true,
          tapToDismiss: true,
          disableTimeOut: false,
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        });
        if (item.status == 'active') {
          item.status = 'blocked';
        } else if (item.status == 'blocked') {
          item.status = 'active';
        }
      });
  }
  showCards() {
    this.cats.cards().subscribe((stats: any) => {
      console.log(stats.data);
      this.data[0].details = stats.data;
    });
  }
  showTaps() {
    this.cats.taps().subscribe((stats: any) => {
      this.data[0].details = stats.data;
    });
  }
  Editcard(
    item: any,
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    var dialogRef = this.dialog.open(EditComponent, {
      ...largepopup,
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        item: item,
        type: this.data[0].type == 'Cards' ? 'Card' : 'Tap',
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (this.data[0].type == 'Cards') {
          this.showCards();
        } else if (this.data[0].type == 'Taps') {
          this.showTaps();
        }
      }
    });
  }
  openDeleteModal(
    item: any,
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    var dialogRef = this.dialog.open(DeletePopupComponent, {
      ...smallpopup,
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: item.name,
        desc: this.data[0].type == 'Cards' ? ' Delete Card ?' : 'Delete Tap ?',
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (this.data[0].type == 'Cards') {
          this.Deletecard(item.id);
        } else if (this.data[0].type == 'Taps') {
          this.Deletetap(item.id);
        }
      }
    });
  }

  Deletecard(id: any) {
    this.cats.deleteCard(id).subscribe(
      (res: any) => {
        // console.log("success" ,res)
        if (res.status == true) {
          this.toast.success(res.message, 'success', {
            tapToDismiss: true,
            disableTimeOut: false,
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
          });

          this.showCards();
        } else {
          this.toast.error(res.message, 'error');
        }
      },
      (err: any) => {
        this.toast.error(err.error.errors[0], 'error', {
          closeButton: true,
          tapToDismiss: true,
          disableTimeOut: false,
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        });
      }
    );
  }
  Deletetap(id: any) {
    this.cats.deletetap(id).subscribe(
      (res: any) => {
        // console.log("success" ,res)
        if (res.status == true) {
          this.toast.success(res.message, 'success', {
            tapToDismiss: true,
            disableTimeOut: false,
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
          });

          this.showTaps();
        } else {
          this.toast.error(res.message, 'error');
        }
      },
      (err: any) => {
        this.toast.error(err.error.errors[0], 'error', {
          closeButton: true,
          tapToDismiss: true,
          disableTimeOut: false,
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        });
      }
    );
  }
}
