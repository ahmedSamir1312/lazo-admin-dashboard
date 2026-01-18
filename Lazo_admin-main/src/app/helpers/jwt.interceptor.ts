import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  const toaster = inject(ToastrService);

  const authToken = localStorage.getItem('access_token_admin');
  // Clone the request and add the authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: authToken ? ` Bearer ${authToken}` : '',
      lang: 'en',
    },
  });

  // Pass the cloned request with the updated header to the next handler
  return next(authReq).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 500) {
          toaster.error(err.error.errors[0], 'Error', {
            closeButton: true,
            tapToDismiss: true,
            disableTimeOut: false,
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
          });
        }
      }
      return throwError(() => err);
    })
  );
};
