import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Định nghĩa giao diện ApiResponse
interface ApiResponse {
  message: string;
  // Thêm các thuộc tính khác nếu cần
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.http.post<ApiResponse>('http://localhost/api/routes/userRoutes.php', {
        action: 'register',
        ...this.registerForm.value
      }).subscribe(response => {
        console.log('Register response:', response);
        if (response.message === 'Registration successful.') {
          this.successMessage = 'Đăng ký thành công!'; // Hoặc chuyển hướng đến trang đăng nhập
        } else {
          this.errorMessage = response.message; // Hiển thị thông báo lỗi
        }
      }, error => {
        console.error('Error occurred:', error);
        this.errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.';
      });
    }
  }
}
