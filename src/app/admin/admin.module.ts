import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { RouterModule } from '@angular/router'; // Import RouterModule
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component'; // Import AdminComponent
import { AdminLoginComponent } from './admin-login/admin-login.component'; // Import AdminLoginComponent
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagementUsersComponent } from './management-users/management-users.component';
import { EditUserComponent } from './management-users/edit-user/edit-user.component';
import { ManagementProductsComponent } from './management-products/management-products.component'; // Import DashboardComponent
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    AdminComponent,       // Đảm bảo khai báo AdminComponent
    AdminLoginComponent,  // Đảm bảo khai báo AdminLoginComponent
    DashboardComponent,
    ManagementUsersComponent,
    EditUserComponent,
    ManagementProductsComponent     // Đảm bảo khai báo DashboardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, // Thêm ReactiveFormsModule vào imports
    RouterModule,
    FormsModule,
    MatTabsModule
  ]
})
export class AdminModule { }
