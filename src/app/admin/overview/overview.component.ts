import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ManagementUsersComponent } from '../management-users/management-users.component';
import { ManagementProductsComponent } from '../management-products/management-products.component';
import { SalesStatisticsComponent } from '../sales-statistics/sales-statistics.component';
import { Chart, TooltipItem, TooltipModel } from 'chart.js/auto';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'] // Đã sửa từ styleUrl thành styleUrls
})
export class OverviewComponent implements OnInit, AfterViewInit  {
  tongSanPham: number = 0; // Khởi tạo với 0
  tongThanhVien: number =0;
  tongDonHang: number =0;
  tongDoanhThu: number = 0;
  tongLoiNhuan: number = 0;
  products: Product[] = [];
  donHangHomNay: number = 0;
  donHangTuan: number = 0;
  // donHangThang: number = 0;
  doanhThuHomNay: number = 0;
  doanhThuTuan: number = 0;
  // doanhThuThang: number = 0
  chiTietOrder: any[] = [];
  currentComponent: any = null;
  chart: any;
  donHangData: any[] = [];
  orderData: any[] = [];


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getData(); // Sửa tên hàm từ getDataint thành getData

    // Tính số lượng đơn hàng cho mỗi tháng

  }

  ngAfterViewInit(): void {
    // this.mapData();
  }

  getData() {
    this.http.get('http://localhost:3000/api/management-products/get-products').subscribe(
      (response: any) => {
          this.products = response.data;
          this.tongSanPham = this.products.length;

      },
      (error) => {
        //
      }
    );

    this.http.get('http://localhost:3000/api/users/get-users').subscribe(
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

    this.http.get('http://localhost:3000/api/orders/get-all-order').subscribe(
      (response: any) => {
        if(response.status === "success"){
          this.chiTietOrder = response.data
          console.log("CHI tiết", this.chiTietOrder)
      }
    }

    )

    this.http.get('http://localhost:3000/api/orders/get-order').subscribe(
      (response: any) => {
        if (response.status === "success") {
          this.tongDonHang = response.data.length;
          this.donHangData = response.data.map((item:any) => {
            const date = new Date(item.ngay_mua);
            return `${date.getMonth() + 1}-${date.getFullYear()}`;
          });
          console.log("CHECK this.donHangData", this.donHangData)
          this.mapData();

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


            }})
      }},
      (error) => {
        console.error("Lỗi khi gọi API:", error);
        //
      }
    );


  }







  mapData(){
    const donHangByMonth = this.donHangData.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    // Tạo danh sách các tháng từ "01-2024" đến "12-2024"
    const months: string[] = [];
    const monthsInYear = Array.from({ length: 12 }, (_, i) => `${i + 1}-${2024}`);
    monthsInYear.forEach(month => {
      months.push(month);
    });

    const orderCounts = months.map(month => donHangByMonth[month] || 0);

    // Vẽ biểu đồ
    this.chart = new Chart('donHangChart', {
      type: 'bar', // Loại biểu đồ: có thể là 'line', 'bar', 'pie', ...
      data: {
        labels: months, // Các tháng và năm
        datasets: [{
          label: 'Số Đơn Hàng',
          data: orderCounts, // Số lượng đơn hàng theo tháng
          backgroundColor: 'rgba(0, 123, 255, 0.5)', // Màu nền
          borderColor: 'rgba(0, 123, 255, 1)', // Màu viền
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // mapData() {
  //   const donHangByMonth = this.donHangData.reduce((acc, curr) => {
  //     acc[curr] = (acc[curr] || 0) + 1;
  //     return acc;
  //   }, {});

  //   // Tạo danh sách các tháng từ "01-2024" đến "12-2024"
  //   const months: string[] = [];
  //   const monthsInYear = Array.from({ length: 12 }, (_, i) => `${i + 1}-2024`);
  //   monthsInYear.forEach(month => {
  //     months.push(month);
  //   });

  //   // Lấy số lượng đơn hàng cho mỗi tháng (0 nếu không có)
  //   const orderCounts = months.map(month => donHangByMonth[month] || 0);

  //   // Tạo danh sách trạng thái đơn hàng cho mỗi tháng
  //   const orderStatuses = months.map(month => {
  //     const statuses = this.donHangData
  //       .filter(order => order.ngay_mua?.startsWith(month))
  //       .map(order => order.trang_thai);
  //     return statuses.join(', ') || 'Chưa có trạng thái'; // If no statuses, return "No status"
  //   });

  //   // Vẽ biểu đồ
  //   this.chart = new Chart('donHangChart', {
  //     type: 'bar', // Loại biểu đồ
  //     data: {
  //       labels: months, // Các tháng và năm
  //       datasets: [{
  //         label: 'Số Đơn Hàng',
  //         data: orderCounts, // Số lượng đơn hàng theo tháng
  //         backgroundColor: 'rgba(0, 123, 255, 0.5)', // Màu nền
  //         borderColor: 'rgba(0, 123, 255, 1)', // Màu viền
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       responsive: true,
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       },
  //       plugins: {
  //         tooltip: {
  //           callbacks: {
  //             // Tùy chỉnh tooltip để hiển thị trạng thái đơn hàng
  //             label: function(context) {
  //               const month = context.label;
  //               const count = context.raw;
  //               const statuses = orderStatuses[months.indexOf(month)];
  //               return `${month}: ${count} đơn hàng,
  //               Trạng thái: ${status}`;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   });
  // }





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
