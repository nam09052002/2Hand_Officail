import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ManagementUsersComponent } from '../management-users/management-users.component';
import { ManagementProductsComponent } from '../management-products/management-products.component';
import { SalesStatisticsComponent } from '../sales-statistics/sales-statistics.component';

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
  doanhThuHomNay: number = 0;
  doanhThuTuan: number = 0;
  doanhThuThang: number = 0
  chiTietOrder: any[] = [];
  currentComponent: any = null;

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

    this.http.get('http://localhost/api/orders/get-all-order.php').subscribe(
      (response: any) => {
        if(response.status === "success"){
          this.chiTietOrder = response.data
          console.log("CHI tiết", this.chiTietOrder)
      }
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
            // if (order.trang_thai === 'da_giao') {
            //   const chiTietAllOrder = this.chiTietOrder.filter((i:any) => i.id_don_hang === order.id_don_hang)
            //   console.log("CHECK chiTietAllOrder", chiTietAllOrder)
            //   this.tongDoanhThu += parseFloat(chiTietAllOrder.tong_tien);
            //   console.log("this.tongDoanhThu" , this.tongDoanhThu)

            //   chiTietAllOrder.forEach((chiTiet: any) => {
            //     this.products.forEach((item: any) => {
            //         console.log("CHECK itemitem", item);
            //         if (item.ten_san_pham === chiTiet.ten_san_pham) {
            //             const loiNhuan = (parseFloat(chiTiet.tong_tien) - parseFloat(item.gia_nhap)) * parseFloat(chiTiet.so_luong);
            //             this.tongLoiNhuan += loiNhuan;
            //         }
            //     });
            // });
            if (order.trang_thai === 'da_giao') {
              // Lọc chi tiết đơn hàng tương ứng với id_don_hang
              const chiTietAllOrder = this.chiTietOrder.filter((i: any) => i.id_don_hang === order.id_don_hang);
              console.log("CHECK chiTietAllOrder", chiTietAllOrder);

              // Tính tổng doanh thu từ chi tiết đơn hàng
              const tongTienChiTiet = chiTietAllOrder.reduce((total: number, chiTiet: any) => {
                  return total + (parseFloat(chiTiet.tong_tien) || 0); // Cộng dồn vào tổng
              }, 0);

              this.tongDoanhThu += tongTienChiTiet; // Cập nhật tổng doanh thu
              console.log("this.tongDoanhThu", this.tongDoanhThu);

              // Tính lợi nhuận cho từng sản phẩm trong chi tiết đơn hàng
              chiTietAllOrder.forEach((chiTiet: any) => {
                  this.products.forEach((item: any) => {
                      console.log("CHECK itemitem", item);
                      if (item.ten_san_pham === chiTiet.ten_san_pham) {
                          // Tính lợi nhuận từ sản phẩm
                          const loiNhuan = (parseFloat(chiTiet.tong_tien) - parseFloat(item.gia_nhap)) * parseFloat(chiTiet.so_luong);
                          this.tongLoiNhuan += loiNhuan; // Cập nhật tổng lợi nhuận
                      }
                  });
              });


            }
            const orderDate = order.ngay_mua.split(' ')[0].trim();

            if (orderDate === todayString) {
              this.donHangHomNay += 1;
              if (order.trang_thai === 'da_giao') {
                  // Lấy chi tiết đơn hàng tương ứng
                  const chiTietAllOrder = this.chiTietOrder.filter((i: any) => i.id_don_hang === order.id_don_hang);

                  // Tính tổng tiền từ chi tiết đơn hàng
                  chiTietAllOrder.forEach((chiTiet: any) => {
                      this.doanhThuHomNay += parseFloat(chiTiet.tong_tien) || 0; // Cộng dồn vào doanh thu hôm nay
                  });
              }
            }

              // Tính doanh thu tuần
              if (orderDate >= firstDayOfWeekString && orderDate <= todayString) {
                this.donHangTuan += 1;

                if (order.trang_thai === 'da_giao') {
                  // Lấy chi tiết đơn hàng tương ứng
                  const chiTietAllOrder = this.chiTietOrder.filter((i: any) => i.id_don_hang === order.id_don_hang);

                  // Tính tổng tiền từ chi tiết đơn hàng
                  chiTietAllOrder.forEach((chiTiet: any) => {
                      this.doanhThuTuan += parseFloat(chiTiet.tong_tien) || 0; // Cộng dồn vào doanh thu hôm nay
                  });
              }
            }



            // Tính doanh thu tháng
            if (orderDate >= firstDayOfMonthString && orderDate <= todayString) {
              this.donHangThang += 1;

              // Lấy chi tiết đơn hàng và tính doanh thu cho tháng
              if (order.trang_thai === 'da_giao') {
                // Lấy chi tiết đơn hàng tương ứng
                const chiTietAllOrder = this.chiTietOrder.filter((i: any) => i.id_don_hang === order.id_don_hang);

                // Tính tổng tiền từ chi tiết đơn hàng
                chiTietAllOrder.forEach((chiTiet: any) => {
                    this.doanhThuThang += parseFloat(chiTiet.tong_tien) || 0; // Cộng dồn vào doanh thu hôm nay
                });
            }
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

  showManagementUsers() {
    console.log("CHECK")
    this.currentComponent = ManagementUsersComponent;
  }

  showManagementProducts() {
    this.currentComponent = ManagementProductsComponent;
  }

  showSalesStatistics() {
    this.currentComponent = SalesStatisticsComponent;

  }

}
