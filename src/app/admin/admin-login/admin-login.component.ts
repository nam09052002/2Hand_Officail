import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
    loginForm: FormGroup;
    ten_dang_nhap: string = '';
    mat_khau: string = '';

    constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
      this.loginForm = this.fb.group({
        ten_dang_nhap: ['', Validators.required],
        mat_khau: ['', Validators.required]
      });
    }

    ngOnInit(): void {}

    onSubmit() {
      const apiUrl = 'http://localhost:3000/api/users/login';

    // Dữ liệu gửi đến backend
    const loginData = {
        ten_dang_nhap: this.ten_dang_nhap,
        mat_khau: this.mat_khau,
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
    })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          if (data.status === 'success' && data.user && data.user?.vai_tro == 'admin') {

              localStorage.setItem('user', JSON.stringify(data.user));

              alert("Đăng nhập thành công!")

              this.router.navigate(['/admin/dashboard']);
          } else {
            alert("Đăng nhập thất bại!")
          }
      })
      .catch(error => {
          console.error('Error:', error);
      });
    }
    }

