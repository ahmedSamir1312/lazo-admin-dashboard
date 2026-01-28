
import { Routes } from '@angular/router';
import { orderDetailsResolver } from '../../resolver/order-details.resolver';
import { providerDetailsResolver } from '../../resolver/provider-details.resolver';
 
export const routes: Routes = [
  { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
  {
    path: 'Dashboard',
    loadComponent: () =>
      import('../../Components/dashboard/home/home.component').then(
        (x) => x.HomeComponent
      ),
  },
  {
    path: 'Profile',
    loadComponent: () =>
      import('../../Components/profile/profile.component').then(
        (x) => x.ProfileComponent
      ),
  },
  {
    path: 'Users',
    loadComponent: () =>
      import('../../Components/users/users.component').then(
        (x) => x.UsersComponent
      ),
  },
  {
    path: 'delivery',
    loadComponent: () =>
      import('../../Components/delivery/delivery.component').then(
        (x) => x.DeliveryComponent
      ),
  },
  {
    path: 'Fees',
    loadComponent: () =>
      import('../../Components/admin-fees/admin-fees.component').then(  
        (x) => x.AdminFeesComponent 
      ),  
  },
  {
    path: 'Admins',
    loadComponent: () =>
      import('../../Components/admins/show/show.component').then(
        (x) => x.ShowComponent
      ),
  },
  {
    path: 'Categories',
    loadComponent: () =>
      import('../../Components/Categories/home/home.component').then(
        (x) => x.HomeComponent
      ),
  },
  {
    path: 'Occasions',
    loadComponent: () =>
      import('../../Components/Occasions/home/home.component').then(
        (x) => x.HomeComponent
      ),
  },
  {
    path: 'Promo_Code',
    loadComponent: () =>
      import('../../Components/Promo_codes/home/home.component').then(
        (x) => x.HomeComponent
      ),
  },
  {
    path: 'add_provider',
    loadComponent: () =>
      import(
        '../../Components/Service_Providers/add-provider/add-provider.component'
      ).then((x) => x.AddProviderComponent),
  },
  {
    path: 'Ready_orders',
    loadComponent: () =>
      import('../../Components/Ready_orders/home/home.component').then(
        (x) => x.HomeComponent
      ),
    data: { order_family: 'ready_made', title: 'Ready made gift orders' },
  },
  {
    path: 'Service_Providers',
    loadComponent: () =>
      import('../../Components/Service_Providers/home/home.component').then(
        (x) => x.HomeComponent
      ),
    data: { account_type: 'service_provider', title: 'Service Providers' },
  },
  {
    path: 'Packaging_Providers',
    loadComponent: () =>
      import('../../Components/Service_Providers/home/home.component').then(
        (x) => x.HomeComponent
      ),
    data: { account_type: 'packaging_provider', title: 'Packaging Providers' },
  },
  //   Packaging_Providers
  {
    path: 'UnRead_orders',
    loadComponent: () =>
      import('../../Components/Ready_orders/home/home.component').then(
        (x) => x.HomeComponent
      ),
    data: { order_family: 'collective', title: 'UnReady made gift orders' },
  },
  {
    path: 'Order_details/:id',
    loadComponent: () =>
      import(
        '../../Components/Ready_orders/order-details/order-details.component'
      ).then((x) => x.OrderDetailsComponent),
    resolve: { order: orderDetailsResolver },
  },
  {
    path: 'provider_details/:id',
    loadComponent: () =>
      import(
        '../../Components/Service_Providers/provider-details/provider-details.component'
      ).then((x) => x.ProviderDetailsComponent),
    resolve: { provider: providerDetailsResolver },
  },
  //  UnRead_orders
  {
    path: 'Client_App_Files',
    loadComponent: () =>
      import('../../Components/Client_App_Files/home/home.component').then(
        (x) => x.HomeComponent
      ),
  },
  {
    path: 'provider_App_Files',
    loadComponent: () =>
      import('../../Components/provider_App_Files/home/home.component').then(
        (x) => x.HomeComponent
      ),
  },
  //  Cards and taps designs
  {
    path: 'Banners',
    loadComponent: () =>
      import('../../Components/banners/home/home.component').then(
        (x) => x.HomeComponent
      ),
  },
  {
    path: 'Tags',
    loadComponent: () =>
      import('../../Components/tags/home/home.component').then(
        (x) => x.HomeComponent
      ),
  },
  {
    path: 'Cards_taps',
    loadComponent: () =>
      import('../../Components/cards_taps/home/home.component').then(
        (x) => x.HomeComponent
      ),
  },
  {
    path: 'Colors',
    loadComponent: () =>
      import('../../Components/colors/home/home.component').then(
        (x) => x.HomeComponent
      ),
  },
  {
    path: 'Sizes',
    loadComponent: () =>
      import('../../Components/size/home/home.component').then(
        (x) => x.HomeComponent
      ),
  },
  {
    path: 'Cities',
    loadComponent: () =>
      import('../../Components/Cities/home/home.component').then(
        (x) => x.HomeComponent
      ),
  },
  {
    path: 'Countries',
    loadComponent: () =>
      import('../../Components/Countries/home/home.component').then(
        (x) => x.HomeComponent
      ),
  }   
   
  //  Service Provider App Files
];
 