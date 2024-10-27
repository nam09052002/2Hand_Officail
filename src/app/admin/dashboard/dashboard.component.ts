import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManagementUsersComponent } from '../management-users/management-users.component';
import { ManagementProductsComponent } from '../management-products/management-products.component';
import { OverviewComponent } from '../overview/overview.component';
import { SalesStatisticsComponent } from '../sales-statistics/sales-statistics.component';
import { ProductClassificationComponent } from '../product-classification/product-classification.component';
import { VouchersComponent } from '../vouchers/vouchers.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.showOverview()
  }

  showStatisticsDropdown: boolean = false;
  showManagementDropdown: boolean = false;
  currentComponent: any = null;



  // Hàm để toggle dropdown cho thống kê
  toggleStatisticsDropdown(): void {
    this.showStatisticsDropdown = !this.showStatisticsDropdown;
  }

  // Hàm để toggle dropdown cho quản lý
  toggleManagementDropdown(): void {
    this.showManagementDropdown = !this.showManagementDropdown;
  }

  // Phương thức để hiển thị quản lý người dùng
  showManagementUsers() {
    this.currentComponent = ManagementUsersComponent; // Gán component quản lý người dùng
  }

  showManagementProducts() {
    this.currentComponent = ManagementProductsComponent;
  }

  showOverview(){
    this.currentComponent = OverviewComponent;
  }
  showSalesStatistics() {
    this.currentComponent = SalesStatisticsComponent;

  }
  showProductClassification() {
    this.currentComponent = ProductClassificationComponent;
  }
  showVouchers(){
    this.currentComponent = VouchersComponent;

  }




  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/admin']);
  }

}
