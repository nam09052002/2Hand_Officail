import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'] // Đã sửa từ styleUrl thành styleUrls
})
export class OverviewComponent implements OnInit {
  tongSanPham: number = 0; // Khởi tạo với 0
  tongThanhVien: number =0;
  tongDonHang: number =0;
  tongDoanhThu: number = 0;
  tongLoiNhuan: number = 0;
  products: Product[] = [];
  donHangHomNay: number = 0;
  donHangTuan: number = 0;
  donHangThang: number = 0;


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getData(); // Sửa tên hàm từ getDataint thành getData
  }

  getData() {
    this.http.get('http://localhost/api/management-products/get-products.php').subscribe(
      (response: any) => {
          this.products = response.products;
          this.tongSanPham = this.products.length;

      },
      (error) => {
        //
      }
    );

    this.http.get('http://localhost/api/users/get-users.php').subscribe(
      (response: any) => {
        if(response.status === "success"){
          this.tongThanhVien = response.data.length

        } else {
          this.tongThanhVien = 0
        }
      },
      (error) => {
        //
      }
    )

    this.http.get('http://localhost/api/orders/get-order.php').subscribe(
      (response: any) => {
        if (response.status === "success") {
          this.tongDonHang = response.data.length;
          this.tongDoanhThu = 0;
          this.tongLoiNhuan = 0;
          this.donHangHomNay = 0;
          this.donHangTuan = 0;
          this.donHangThang = 0;

          const today = new Date();

          const todayString = today.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
            .split('/').reverse().join('-');
          // Xác định ngày đầu tuần và đầu tháng
          const firstDayOfWeek = new Date(today);
          firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Chủ nhật

          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

          const firstDayOfWeekString = firstDayOfWeek.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
            .split('/').reverse().join('-');
          const firstDayOfMonthString = firstDayOfMonth.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
            .split('/').reverse().join('-');
          response.data.forEach((order: any) => {
            if (order.trang_thai === 'da_giao') {
              this.tongDoanhThu += parseFloat(order.tong_tien);

              this.products.forEach((item: any) => {
                if (item.ten_san_pham === order.ten_san_pham) {
                  this.tongLoiNhuan += (parseFloat(order.tong_tien) - parseFloat(item.gia_nhap)) * parseFloat(order.so_luong);
                }
              });
            }
            const orderDate = order.ngay_mua.split(' ')[0].trim();

              if (orderDate === todayString) {
                this.donHangHomNay += 1;
              }
              if (orderDate >= firstDayOfWeekString && orderDate <= todayString) {
                this.donHangTuan += 1;
              }
              if (orderDate >= firstDayOfMonthString && orderDate <= todayString) {
                this.donHangThang += 1;
              }
          });
        } else {
          this.tongDoanhThu = 0;
          this.tongDonHang = 0;
          this.tongLoiNhuan = 0;
          this.donHangHomNay = 0;
          this.donHangTuan = 0;
          this.donHangThang = 0;
        }
      },
      (error) => {
        console.error("Lỗi khi gọi API:", error);
        //
      }
    );


  }

}
