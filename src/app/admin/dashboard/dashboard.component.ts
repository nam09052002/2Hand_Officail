import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManagementUsersComponent } from '../management-users/management-users.component';
import { ManagementProductsComponent } from '../management-products/management-products.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private router: Router) {}

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





  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/admin']);
  }

}
