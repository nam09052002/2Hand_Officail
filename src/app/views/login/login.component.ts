import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = ''; // Khai báo biến lỗi

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post('http://localhost/api/routes/userRoutes.php', {
        action: 'login',
        ...this.loginForm.value
      }).subscribe(
        response => {
          console.log('Login response:', response);
          if (response && (response as any).success) { // Chuyển đổi response thành kiểu any
            // Xử lý phản hồi từ server
          } else {
            this.errorMessage = (response as any).message || 'Đăng nhập thất bại'; // Xử lý lỗi
          }
        },
        error => {
          this.errorMessage = 'Có lỗi xảy ra trong quá trình đăng nhập';
        }
      );
    }
  }
}
