import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit {
  activeModal: 'updateInfo' | 'changePassword' | 'orderHistory' | 'showOrder' | null = null;
  passwords = { currentPassword: '', newPassword: '', confirmPassword: '' };
  orderHistory: any[] = [];
  userInfo!: User;
  showOrder = false;

  constructor(
    private http: HttpClient,

  ) {}

  ngOnInit() {
    if (this.activeModal === 'orderHistory') {
      this.fetchOrderHistory();
    }
    this.userInfo = JSON.parse(localStorage.getItem('user') || 'null');
    this.getOrder()
  }
  getOrder(){
    this.http.get('http://localhost/api/orders/get-order.php')
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            const allOrder = response.data;
            this.orderHistory = allOrder.filter((order: any) => order.id_nguoi_dung === this.userInfo.id_nguoi_dung)

          } else {
            alert('Lỗi: ' + response.message);
          }
        },
        (error) => {
          alert('Có lỗi xảy ra khi cập nhật thông tin!');
          console.error(error);
        }
      );
  }

  openModal(type: 'updateInfo' | 'changePassword' | 'orderHistory') {
    this.activeModal = type;
    if (type === 'orderHistory') {
      this.fetchOrderHistory();
    }
  }

  closeModal() {
    this.activeModal = null;
  }

  getModalTitle() {
    switch (this.activeModal) {
      case 'updateInfo':
        return 'Cập nhật thông tin';
      case 'changePassword':
        return 'Đổi mật khẩu';
      case 'orderHistory':
        return 'Lịch sử đơn hàng';
      case 'showOrder':
      return 'Chi tiết đơn hàng';
      default:
        return '';
    }
  }

  onSubmitUpdateInfo() {
    if (!this.userInfo.email || !this.userInfo.ten_dang_nhap || !this.userInfo.ho_va_ten || !this.userInfo.so_dien_thoai || !this.userInfo.dia_chi){
      alert("Vui lòng nhập đầy đủ các thông tin!")
      return
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.userInfo.email)) {
        alert("Vui lòng nhập địa chỉ email hợp lệ!");
        return;
    }

    const phonePattern = /^[0-9]{10,11}$/;
    if (!phonePattern.test(this.userInfo.so_dien_thoai)) {
        alert("Vui lòng nhập số điện thoại hợp lệ!");
        return;
    }
    const params = {
      id_nguoi_dung: this.userInfo.id_nguoi_dung,
      ten_dang_nhap : this.userInfo.ten_dang_nhap,
      ho_va_ten: this.userInfo.ho_va_ten,
      email: this.userInfo.email,
      so_dien_thoai: this.userInfo.so_dien_thoai,
      dia_chi: this.userInfo.dia_chi

    }
    // Gọi API cập nhật thông tin người dùng
    this.http.post('http://localhost/api/users/update-user.php', params)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            alert('Cập nhật thông tin thành công!');
            localStorage.setItem('user', JSON.stringify(response.data));
          } else {
            alert('Lỗi: ' + response.message);
          }
        },
        (error) => {
          alert('Có lỗi xảy ra khi cập nhật thông tin!');
          console.error(error);
        }
      );
    this.closeModal();
  }

  onSubmitChangePassword() {
    const params = {
      id_nguoi_dung: this.userInfo.id_nguoi_dung,
      mat_khau : this.passwords.currentPassword,
      mat_khau_moi: this.passwords.newPassword,
      xac_nhan_mat_khau: this.passwords.confirmPassword
    }
    // Gọi API cập nhật thông tin người dùng
    this.http.post('http://localhost/api/users/change-password-user.php', params)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            alert('Cập nhật mật khẩu thành công!');
            this.closeModal();
          } else {
            alert(response.message);
            return
          }
        },
        (error) => {
          alert('Có lỗi xảy ra khi cập nhật thông tin!');
        }
      );
  }

  fetchOrderHistory() {
    // this.orderService.getOrderHistory().subscribe(data => {
    //   this.orderHistory = data;
    // });
  }

  viewOrderDetails(orderId: number): void {
    this.showOrder = true;
    // Logic để hiển thị chi tiết đơn hàng, ví dụ:
    console.log(`Xem chi tiết đơn hàng ID: ${orderId}`);
    // Có thể mở modal hoặc chuyển hướng đến trang chi tiết đơn hàng
  }
}
