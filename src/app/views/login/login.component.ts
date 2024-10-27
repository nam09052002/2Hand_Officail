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
  email: string = '';
  islogin: boolean = true;
    // Mặc định hiển thị modal đăng nhập
  isRegister: boolean = false; // Mặc định không hiển thị modal đăng ký


  constructor(private router: Router) {}

  onLoginSubmit() {
    const formData = new FormData();
    formData.append('ten_dang_nhap', this.ten_dang_nhap);
    formData.append('mat_khau', this.mat_khau);

    fetch('http://localhost/api/users/user-login.php', {
        method: 'POST',
        body: formData,
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
    // Kiểm tra định dạng email bằng biểu thức chính quy
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Email không hợp lệ. Vui lòng nhập lại.';
      return; // Ngừng thực hiện hàm nếu email không hợp lệ
    }

    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('ten_dang_nhap', this.ten_dang_nhap);
    formData.append('mat_khau', this.mat_khau);

    fetch('http://localhost/api/users/user-register.php', {
      method: 'POST',
      body: formData
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
