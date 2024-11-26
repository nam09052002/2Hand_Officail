import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  ho_va_ten: string = '';
  dia_chi: string = '';
  ten_dang_nhap: string = '';
  mat_khau: string = '';
  errorMessage: string = '';
  email: string = '';
  so_dien_thoai: string = '';
  islogin: boolean = true;
    // Mặc định hiển thị modal đăng nhập
  isRegister: boolean = false; // Mặc định không hiển thị modal đăng ký


  constructor(private router: Router) {}

  onLoginSubmit() {
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
        if (data.status === 'success' && data.user) { // Kiểm tra nếu người dùng tồn tại
            this.errorMessage = ''; // Xóa thông báo lỗi

            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem('user', JSON.stringify(data.user));

            alert(data.message)

            // Điều hướng đến trang chủ
            this.router.navigate(['/']);
            // Thay '/' bằng đường dẫn trang chủ của bạn
        } else {
            // Đăng nhập thất bại - hiển thị thông báo lỗi
            this.errorMessage = data.message || 'Tên đăng nhập hoặc mật khẩu không chính xác';
            console.error(this.errorMessage);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        this.errorMessage = 'Có lỗi xảy ra, vui lòng thử lại!';
    });
  }


  toggleRegister() {
    this.islogin = false;
    this.isRegister = true;
    this.errorMessage = '';

  }
  onRegisterSubmit() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Email không hợp lệ. Vui lòng nhập lại.';
      return;
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(this.so_dien_thoai)) {
      this.errorMessage = 'Số điện thoại không hợp lệ!'
      return
    }
    const formData = {
      email: this.email,
      ten_dang_nhap: this.ten_dang_nhap,
      mat_khau: this.mat_khau,
      ho_va_ten: this.ho_va_ten,
      so_dien_thoai: this.so_dien_thoai,
      dia_chi: this.dia_chi,
    };

    fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Đảm bảo đúng kiểu dữ liệu
      },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
        // Đăng ký thành công
        alert(data.message)
        // Điều hướng đến trang đăng nhập hoặc trang chủ sau khi đăng ký
        this.router.navigate(['/login']);
        this.toggleLogin();
        } else {
        // Đăng ký thất bại
        this.errorMessage = data.message;
        }
      })
    .catch(error => {
        console.error('Error:', error);
        this.errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại!';
      });
  }



  toggleLogin() {
    this.islogin = true;
    this.isRegister = false;
    this.errorMessage = '';
  }
}
