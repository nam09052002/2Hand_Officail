import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-sales-statistics',
  templateUrl: './sales-statistics.component.html',
  styleUrls: ['./sales-statistics.component.css']
})
export class SalesStatisticsComponent {
  donHangHomNay: number = 0;
  donHangTuan: number = 0;
  donHangThang: number = 0;
  searchTerm: string = '';
  selectedStatus: string = 'tat_ca'; // Giá trị mặc định
  startDate: string | null = null;
  endDate: string | null = null;
  orders: any[] = []; // Store all orders
  filteredOrders: any[] = []; // Store filtered orders
  statuses: string[] = ['tat_ca', 'cho_xu_ly','dang_giao', 'da_xac_nhan', 'da_giao', 'da_huy']; // Danh sách trạng thái
  status: string[] = ['cho_xu_ly','dang_giao', 'da_xac_nhan', 'da_giao', 'da_huy'];
  statusDisplayNames: { [key: string]: string } = {
    tat_ca: 'Tất cả đơn hàng',
    cho_xu_ly: 'Chờ xử lý',
    da_xac_nhan: 'Đã xác nhận',
    dang_giao: 'Đang vận chuyển',
    da_giao: 'Đã giao',
    da_huy: 'Đã hủy'
  };
  changeStatus: { [key: string]: string } = {
    cho_xu_ly: 'Chờ xử lý',
    da_xac_nhan: 'Đã xác nhận',
    dang_giao: 'Đang vận chuyển',
    da_giao: 'Đã giao',
    da_huy: 'Đã hủy'
  };
  message: string = '';
  isOrderDetailModalOpen = false;
  selectedOrder: any;
  showOrder: any;
  showAllOrder: any;
  tongSoDonHang: number = 0;
  soDonChoXuLy: number = 0;
  soDonDaXacNhan: number = 0;
  soDonDangGiao: number = 0;
  soDonDaGiao: number = 0;
  soDonDaHuy: number = 0;
  tongDoanhThu: number = 0;
  tongLoiNhuan: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadAllOrrder();
  }

  loadOrders() {
    this.http.get('http://localhost/api/orders/get-order.php').subscribe(
      (response: any) => {
        if (response.status === "success") {
          this.resetCounts(); // Reset order counts
          this.orders = response.data; // Store all orders

          const today = new Date();
          const todayString = this.formatDate(today);
          const firstDayOfWeekString = this.formatDate(this.getFirstDayOfWeek(today));
          const firstDayOfMonthString = this.formatDate(this.getFirstDayOfMonth(today));

          this.orders.forEach((order: any) => {
            const orderDate = order.ngay_mua.split(' ')[0].trim();
            if (orderDate === todayString) {
              this.donHangHomNay++;
            }
            if (orderDate >= firstDayOfWeekString && orderDate <= todayString) {
              this.donHangTuan++;
            }
            if (orderDate >= firstDayOfMonthString && orderDate <= todayString) {
              this.donHangThang++;
            }
          });

          this.filteredOrders = this.orders.slice().sort((a, b) => {
            return b.id_don_hang - a.id_don_hang; // Sắp xếp theo thứ tự giảm dần
        }
      );
        } else {
          this.resetCounts(); // Reset counts on error
        }
      },
      (error) => {
        console.error("Lỗi khi gọi API:", error);
      }
    );
  }

  loadAllOrrder() {
    this.http.get('http://localhost/api/orders/get-all-order.php').subscribe(
      (response: any) => {
        if (response.status === "success") {
          if (Array.isArray(response.data)) {
            this.showAllOrder = response.data; // Gán dữ liệu sản phẩm cho selectedOrder
            console.log("CHECK this.selectedOrder", this.selectedOrder)
        } else {
            console.error("Dữ liệu sản phẩm không hợp lệ:", response.data);
        }
    } else {
        console.error("Trạng thái không thành công:", response.message);
    }
},
(error) => {
    console.error("Lỗi khi gọi API:", error);
}
    );
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .split('/').reverse().join('-'); // Convert to yyyy-mm-dd
  }

  getFirstDayOfWeek(date: Date): Date {
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(date.getDate() - date.getDay()); // Sunday
    return firstDayOfWeek;
  }

  getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  resetCounts(): void {
    this.donHangHomNay = 0;
    this.donHangTuan = 0;
    this.donHangThang = 0;
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearchTerm = order.ho_va_ten.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.so_dien_thoai?.toString().includes(this.searchTerm);
      const matchesStatus = this.selectedStatus === 'tat_ca' || order.trang_thai === this.selectedStatus;
      const matchesDate =
        (!this.startDate || order.ngay_mua >= this.startDate) &&
        (!this.endDate || order.ngay_mua <= this.endDate+1);

      return matchesSearchTerm && matchesStatus && matchesDate;
    }) // Sắp xếp theo id_don_hang giảm dần
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  onDateChange(): void {
    this.applyFilters();
  }

  viewOrderDetails(order: any) {
    console.log("CHECK zzz", order)
    this.showOrder = this.showAllOrder.filter((orderItem: any) => orderItem.id_don_hang === order.id_don_hang);
    console.log("CHECK showOrder" , this.showOrder)
    this.selectedOrder = order; // Lưu thông tin đơn hàng đã chọn
    this.isOrderDetailModalOpen = true;
  }
  updateOrderStatus(order: any) {
    const payload = {
        id_don_hang: order.id_don_hang,
        trang_thai: order.trang_thai
    };

    this.http.post('http://localhost/api/orders/update-order.php', payload)
    .subscribe(
      (response: any) => {
        if (response.status === "success") {
          alert(response.message)
        }

      },
      (error) => {
        console.error("Lỗi khi gọi API:", error);
      })
  }
  closeOrderDetailModal() {
    this.isOrderDetailModalOpen = false; // Đóng modal
    this.selectedOrder = null; // Reset thông tin đơn hàng
  }

  printOrder() {
    // Cách đơn giản để in chi tiết đơn hàng là mở cửa sổ in trình duyệt
    window.print();
}

// Trong component TypeScript
getTotalAmount(): number {
  return this.showOrder.reduce((total: number, product: any) => {
      const productTotal = parseFloat(product.tong_tien);
      return total + (isNaN(productTotal) ? 0 : productTotal);
  }, 0);
}



}
