import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ViewsComponent } from './views/views.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', component: AdminLoginComponent},
      { path: 'dashboard', component: DashboardComponent }, // Route cho dashboard
    ],
  },
  {
    path: '', component: ViewsComponent,
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
