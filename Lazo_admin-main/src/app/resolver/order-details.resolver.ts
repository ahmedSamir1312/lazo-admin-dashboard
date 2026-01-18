import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AppService } from '../services/app.service';

export const orderDetailsResolver: ResolveFn<any> = (route, state) => {
  const id = route.paramMap.get('id');
  return inject(AppService).show_order_details(id)
};
