import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterModule } from '@angular/router'; // Import RouterModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AdminComponent } from './admin/admin.component'; // Import AdminComponent
import { AdminLoginComponent } from './admin/admin-login/admin-login.component'; // Import AdminLoginComponent
import { DashboardComponent } from './admin/dashboard/dashboard.component'; // Import DashboardComponent
import { ManagementUsersComponent } from './admin/management-users/management-users.component'; // Import ManagementUsersComponent
import { EditUserComponent } from './admin/management-users/edit-user/edit-user.component'; // Import EditUserComponent
import { ManagementProductsComponent } from './admin/management-products/management-products.component'; // Import ManagementProductsComponent
import { MatTabsModule } from '@angular/material/tabs'; // Import MatTabsModule
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddProductsComponent } from './admin/management-products/add-products/add-products.component';
import { HeaderComponent } from './views/header/header.component';
import { ViewsComponent } from './views/views.component';
import { BestSellerComponent } from './views/best-seller/best-seller.component';
import { MenProductsComponent } from './views/men-products/men-products.component';
import { GirlProductsComponent } from './views/girl-products/girl-products.component';
import { ProductDetailModalComponent } from './views/product-detail-modal/product-detail-modal.component';
import { LoginComponent } from './views/login/login.component';
import { CartModalComponent } from './views/cart-modal/cart-modal.component';
import { OverviewComponent } from './admin/overview/overview.component';
import { SalesStatisticsComponent } from './admin/sales-statistics/sales-statistics.component';
import { ProductClassificationComponent } from './admin/product-classification/product-classification.component';
import { VouchersComponent } from './admin/vouchers/vouchers.component';
import { UserInfoComponent } from './views/user-info/user-info.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,       // Đảm bảo khai báo AdminComponent
    AdminLoginComponent,  // Đảm bảo khai báo AdminLoginComponent
    DashboardComponent,
    ManagementUsersComponent,
    EditUserComponent,
    ManagementProductsComponent,
    AddProductsComponent,
    ViewsComponent,
    HeaderComponent,
    BestSellerComponent,
    MenProductsComponent,
    GirlProductsComponent,
    ProductDetailModalComponent,
    LoginComponent,
    CartModalComponent,
    OverviewComponent,
    SalesStatisticsComponent,
    ProductClassificationComponent,
    VouchersComponent,
    UserInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    MatTabsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
