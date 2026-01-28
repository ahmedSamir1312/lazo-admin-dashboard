import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  title = 'lazo';
  notifications: boolean = true; // true if there are notifications
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  isMobile: boolean = false;
  sidebar: any = [];
  totalTags: any = [
    {
      id: 1,
      icon: 'assets/images/sidebar/Home.svg',
      name: 'Home',
      path: './Dashboard',
      active: { exact: true },
    },
    {
      id: 2,
      icon: 'assets/images/sidebar/admin.svg',
      name: 'Admins',
      path: './Admins',
      active: { exact: false },
    },
    {
      id: 3,
      icon: 'assets/images/sidebar/User.svg',
      name: 'Users',
      path: './Users',
      active: { exact: false },
    },
    {
      id: 4,
      icon: 'assets/images/sidebar/service_provider.svg',
      name: 'Service Providers',
      path: './Service_Providers',
      active: { exact: false },
    },
    {
      id: 5,
      icon: 'assets/images/sidebar/Packaging_Providers.svg',
      name: 'Packaging Providers',
      path: './Packaging_Providers',
      active: { exact: false },
    },
    {
      id: 6,
      icon: 'assets/images/sidebar/fast-delivery.png',
      name: 'Delivery Time',
      path: './delivery',
      active: { exact: false },
    },
    {
      id: 7,
      icon: 'assets/images/sidebar/money.svg',
      name: 'Fees',
      path: './Fees',
      active: { exact: false },
    },
    {
      id: 8,
      icon: 'assets/images/sidebar/dashboard.svg',
      name: 'Categories',
      path: './Categories',
      active: { exact: false },
    },
    {
      id: 9,
      icon: 'assets/images/sidebar/occasion.svg',
      name: 'Occasions',
      path: './Occasions',
      active: { exact: false },
    },
    {
      id: 10,
      icon: 'assets/images/sidebar/Discount.svg',
      name: 'Promo Code',
      path: './Promo_Code',
      active: { exact: false },
    },
    {
      id: 11,
      icon: 'assets/images/sidebar/ready.svg',
      name: 'Ready made gift orders',
      path: './Ready_orders',
      active: { exact: false },
    },
    {
      id: 12,
      icon: 'assets/images/sidebar/Group.svg',
      name: 'Unready made gift orders',
      path: './UnRead_orders',
      active: { exact: false },
    },
    // Ready made gift orders
    {
      id: 13,
      icon: 'assets/images/sidebar/Paper.svg',
      name: 'Client App Files',
      path: './Client_App_Files',
      active: { exact: false },
    },
    {
      id: 14,
      icon: 'assets/images/sidebar/Paper.svg',
      name: 'Service Provider App Files',
      path: './provider_App_Files',
      active: { exact: false },
    },
    {
      id: 15,
      icon: 'assets/images/sidebar/card.svg',
      name: 'Cards and taps designs',
      path: './Cards_taps',
      active: { exact: false },
    },
    {
      id: 16,
      icon: 'assets/images/sidebar/dashboard.svg',
      name: 'Banners',
      path: './Banners',
      active: { exact: false },
    },
    {
      id: 17,
      icon: 'assets/images/sidebar/Bookmark.svg',
      name: 'Tags',
      path: './Tags',
      active: { exact: false },
    },
    {
      id: 18,
      icon: 'assets/images/sidebar/color.svg',
      name: 'Colors',
      path: './Colors',
      active: { exact: false },
    },
    {
      id: 19,
      icon: 'assets/images/sidebar/Frame.svg',
      name: 'Sizes',
      path: './Sizes',
      active: { exact: false },
    },
    {
      id: 20,
      icon: 'assets/images/sidebar/city.svg',
      name: 'Countries',
      path: './Countries',
      active: { exact: false },
    },
    {
      id: 21,
      icon: 'assets/images/sidebar/city.svg',
      name: 'Cities',
      path: './Cities',
      active: { exact: false },
    } 
    // Bookmark
  ];
  imagePath: any;
  user: any;
  constructor(private userInfo: AuthService, private router: Router) {
    localStorage.setItem('permissions', JSON.stringify(this.totalTags));
    this.userInfo.currentUser.subscribe((user: any) => {
      this.user = user?.data.admin;
    });
  }
  ngOnInit() {
    if (this.user.permissions?.length > 0) {
      let tags_ids = this.user.permissions.map((permission: any) => {
        return permission.id;
      });
      this.sidebar = this.totalTags.filter((item: any) => {
        return tags_ids.includes(item.id);
      });
    } else {
      this.sidebar = this.totalTags;
    }
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['./Login']);
  }
}
