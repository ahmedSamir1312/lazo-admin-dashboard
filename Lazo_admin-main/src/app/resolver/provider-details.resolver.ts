import { ResolveFn } from '@angular/router';
import { AppService } from '../services/app.service';
import { inject } from '@angular/core';

export const providerDetailsResolver: ResolveFn<any> = (route, state) => {
  const id = route.paramMap.get('id');
  return inject(AppService).show_provider_details(id)
};
