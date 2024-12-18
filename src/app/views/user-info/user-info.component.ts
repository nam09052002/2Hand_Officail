import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit {
  activeModal: 'updateInfo' | 'changePassword' | 'orderHistory' | 'showOrder' | null = null;
  passwords = { currentPassword: '', newPassword: '', confirmPassword: '' };
  orderHistory: any[] = [];
  selectedOrderDetails: any | null = null;
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
  // getOrder(){
  //   this.http.get('http://localhost/api/orders/get-order.php')
  //     .subscribe(
  //       (response: any) => {
  //         if (response.status === 'success') {
  //           const allOrder = response.data;
  //           this.orderHistory = allOrder.filter((order: any) => order.id_nguoi_dung === this.userInfo.id_nguoi_dung)
  //           this.http.get('http://localhost/api/orders/get-all-order.php').subscribe((response:any) => {
  //             if (response.status === 'success') {

  //               this.orderHistory.products = response.data.id_don_hang
  //             }

  //           })


  //         } else {
  //           alert('Lỗi: ' + response.message);
  //         }
  //       },
  //       (error) => {
  //         alert('Có lỗi xảy ra khi cập nhật thông tin!');
  //         console.error(error);
  //       }
  //     );
  // }

  getOrder() {
    const userOrders$ = this.http.get<{ status: string, data: any[], message?: string }>('http://localhost:3000/api/orders/get-order');
    const allOrderDetails$ = this.http.get<{ status: string, data: any[], message?: string }>('http://localhost:3000/api/orders/get-all-order');

    forkJoin([userOrders$, allOrderDetails$]).subscribe(
      ([userOrdersResponse, allOrderDetailsResponse]) => {
        if (userOrdersResponse.status === 'success' && allOrderDetailsResponse.status === 'success') {
          const userOrders = userOrdersResponse.data;
          const allOrderDetails = allOrderDetailsResponse.data;

          // Filter user-specific orders
          this.orderHistory = userOrders.filter(order => order.id_nguoi_dung === this.userInfo.id_nguoi_dung);

          // Format orderHistory to include detailed product information
          this.orderHistory = this.orderHistory.map(order => {
            const products = allOrderDetails.filter(detail => detail.id_don_hang === order.id_don_hang);
            return {
              ...order,
              products: products.map(product => ({
                tenSanPham: product.ten_san_pham,
                soLuong: product.so_luong,
                donGia: product.don_gia,
                anhSanPham: product.anh_san_pham,
                tongTien: product.tong_tien,
                mau_sac: product.mau_sac,
                kich_thuoc: product.kich_thuoc,
              }))
            };
          });
          this.orderHistory.sort((a, b) => b.id_don_hang - a.id_don_hang)

          console.log("CHECK this.orderHistory", this.orderHistory)
        } else {
          alert('Lỗi khi lấy thông tin đơn hàng hoặc chi tiết đơn hàng.');
        }
      },
      (error) => {
        // alert('Có lỗi xảy ra khi lấy thông tin đơn hàng!');
        console.error('API Error:', error);
      }
    );
  }

  openModal(type: 'updateInfo' | 'changePassword' | 'orderHistory') {
    this.activeModal = type;
    if (type === 'orderHistory') {
      if (this.orderHistory.length == 0){
        this.closeModal();
        alert("Bạn chưa mua đơn hàng nào !")
        return
      } else {
        this.fetchOrderHistory();
      }
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
    this.http.post('http://localhost:3000/api/users/update-user', params)
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
    this.http.post('http://localhost:3000/api/users/change-password-user', params)
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
          alert('error.message');
        }
      );
  }

  fetchOrderHistory() {
    // this.orderService.getOrderHistory().subscribe(data => {
    //   this.orderHistory = data;
    // });
  }

  viewOrderDetails(id_don_hang: number): void {
    console.log("id_don_hang", id_don_hang)
    this.showOrder = true;
    const selectedOrder = this.orderHistory.find((order: any) => order.id_don_hang === id_don_hang);

    if (selectedOrder) {
        this.selectedOrderDetails = selectedOrder; // Gán thông tin đơn hàng đã tìm thấy
        console.log("Thông tin chi tiết đơn hàng:", this.selectedOrderDetails); // Log thông tin chi tiết
    } else {
        console.log("Không tìm thấy đơn hàng với ID:", id_don_hang);
    }
  }

  closeOrderDetails() {
    this.showOrder = false; // Đóng modal
    this.selectedOrderDetails = null; // Có thể đặt lại thông tin chi tiết
}

cancelOrder(id_don_hang: any){
 const payload = {
        id_don_hang: id_don_hang,
        trang_thai: 'da_huy'
    };

    this.http.post('http://localhost:3000/api/orders/update-order', payload)
    .subscribe(
      (response: any) => {
        if (response.status === "success") {
          this.fetchOrderHistory();
          this.closeOrderDetails();
          this.getOrder();
          alert(response.message)
        }

      },
      (error) => {
        console.error("Lỗi khi gọi API:", error);
      })
}
}
