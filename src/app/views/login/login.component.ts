import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  ten_dang_nhap: string = '';
  mat_khau: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  onSubmit() {
      const formData = new FormData();
      formData.append('ten_dang_nhap', this.ten_dang_nhap);
      formData.append('mat_khau', this.mat_khau);

      fetch('http://localhost/api/users/user-login.php', {
          method: 'POST',
          body: formData,
      })
      .then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
              // Xử lý đăng nhập thành công
              this.errorMessage = data.message
              console.log(data.message);
              // Lưu thông tin người dùng vào local storage (hoặc session storage)
              localStorage.setItem('user', JSON.stringify(data.user));
              // Điều hướng đến trang chủ
              this.router.navigate(['/']); // Thay '/' bằng đường dẫn trang chủ của bạn
          } else {
              // Hiển thị thông báo lỗi
              console.error(data.message);
              this.errorMessage = data.message;
          }
      })
      .catch(error => console.error('Error:', error));
  }
}
