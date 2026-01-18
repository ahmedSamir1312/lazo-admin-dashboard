import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toaster = inject(ToastrService);
  if (localStorage.getItem(`${environment.currentUserKey}`)) {
    return true;
  }
  router.navigate(['./Login']);
  toaster.warning(
    'You are not authorized to access this page login first',
    'Warning',
    {
      closeButton: true,
      tapToDismiss: true,
      disableTimeOut: false,
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
    }
  );
  return false;
};
