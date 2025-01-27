import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sales-statistics',
  templateUrl: './sales-statistics.component.html',
  styleUrls: ['./sales-statistics.component.css']
})
export class SalesStatisticsComponent implements OnInit, AfterViewInit {
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
  showAllOrder: any[] = [];
  tongSoDonHang: number = 0;
  soDonChoXuLy: number = 0;
  soDonDaXacNhan: number = 0;
  soDonDangGiao: number = 0;
  soDonDaGiao: number = 0;
  soDonDaHuy: number = 0;
  tongDoanhThu: number = 0;
  tongLoiNhuan: number = 0;
  products: Product[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadAllOrrder();
    this.loadProducts();
    this.selectedStatus = 'tat_ca';
    // this.applyFilters();

  }
  ngAfterViewInit(): void {
    this.applyFilters();
  }

  loadOrders() {
    this.http.get('http://localhost:3000/api/orders/get-order').subscribe(
      (response: any) => {
        if (response.status === "success") {
          this.resetCounts(); // Reset order counts
          this.orders = response.data; // Store all orders
          this.orders.sort((a: any, b:any) => {
            return b.id_don_hang - a.id_don_hang
          })

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
          });
          this.applyFilters();
          this.calculateTotals();
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
    this.http.get('http://localhost:3000/api/orders/get-all-order').subscribe(
      (response: any) => {
        if (response.status === "success") {
          if (Array.isArray(response.data)) {
            this.showAllOrder = response.data; // Gán dữ liệu sản phẩm cho selectedOrder
            console.log("CHECK this.showAllOrder", this.showAllOrder);
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
  loadProducts() {
    this.http.get('http://localhost:3000/api/management-products/get-products').subscribe(
      (response: any) => {
          this.products = response.data;

      },
      (error) => {
        //
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
        order.so_dien_thoai?.toString().includes(this.searchTerm) ||
        order.id_don_hang?.toString().includes(this.searchTerm)
        ;
      const matchesStatus = this.selectedStatus === 'tat_ca' || order.trang_thai === this.selectedStatus;
      // const formattedNgayMua =  order.ngay_mua; //this.formatDateToYYYYMMDD(order.ngay_mua)
      const formattedNgayMua = new Date(order.ngay_mua);
      const startDate = this.startDate ? new Date(this.startDate) : null;
      const endDate = this.endDate ? new Date(this.endDate) : null;
      // const matchesDate =
      //   (!this.startDate || formattedNgayMua >= this.startDate) &&
      //   (!this.endDate || formattedNgayMua <= this.endDate);
      //   console.log("matchesDate", matchesDate, formattedNgayMua, this.startDate)
      if (endDate) {
        endDate.setHours(23, 59, 59, 999); // Đặt thời gian thành 23:59:59.999
      }
      const matchesDate =
        (!startDate || formattedNgayMua >= startDate) &&
        (!endDate || formattedNgayMua <= endDate);

      return matchesSearchTerm && matchesStatus && matchesDate;
    });

    this.calculateTotals();
  }
  formatDateToYYYYMMDD(dateStr: any) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1); // Cộng thêm 1 ngày
    return date.toISOString().slice(0, 10); // Trả về định dạng yyyy-mm-dd
  }

  calculateTotals() {
    this.tongSoDonHang = this.filteredOrders.length;
    this.soDonChoXuLy = this.filteredOrders.filter(order => order.trang_thai === 'cho_xu_ly').length;
    this.soDonDaXacNhan = this.filteredOrders.filter(order => order.trang_thai === 'da_xac_nhan').length;
    this.soDonDangGiao = this.filteredOrders.filter(order => order.trang_thai === 'dang_giao').length;
    this.soDonDaGiao = this.filteredOrders.filter(order => order.trang_thai === 'da_giao').length;
    this.soDonDaHuy = this.filteredOrders.filter(order => order.trang_thai === 'da_huy').length;

    this.tongDoanhThu = this.filteredOrders.reduce((total, order) => {
        // Lọc các chi tiết đơn hàng từ showAllOrder
        const chiTietAllOrder = this.showAllOrder.filter((i: any) => i.id_don_hang === order.id_don_hang);

        console.log("CHECK chiTietAllOrder", chiTietAllOrder);

        if (this.selectedStatus === 'da_giao' || this.selectedStatus === 'tat_ca') {

          if(order.trang_thai === 'da_giao') {
            const orderTotal = chiTietAllOrder.reduce((subTotal, chiTiet) => {
              const chiTietTotal = parseFloat(chiTiet.tong_tien); // Giả sử chi tiết cũng có thuộc tính tong_tien
              return subTotal + (isNaN(chiTietTotal) ? 0 : chiTietTotal);
          }, 0);
          console.log(orderTotal)

          return total + orderTotal;
          }
        }



        // if (order.trang_thai === 'da_giao' || this.selectedStatus === 'tat_ca') {
        //     const orderTotal = chiTietAllOrder.reduce((subTotal, chiTiet) => {
        //         const chiTietTotal = parseFloat(chiTiet.tong_tien); // Giả sử chi tiết cũng có thuộc tính tong_tien
        //         return subTotal + (isNaN(chiTietTotal) ? 0 : chiTietTotal);
        //     }, 0);
        //     console.log(orderTotal)

        //     return total + orderTotal; // Cộng dồn vào tổng doanh thu
        // }

        return total; // Nếu không phải "đã giao", trả về tổng hiện tại mà không thay đổi
    }, 0);
    this.tongLoiNhuan = 0;
    this.filteredOrders.forEach((order) => {
      if (order.trang_thai === 'da_giao') {
        const chiTietAllOrder = this.showAllOrder.filter((i: any) => i.id_don_hang === order.id_don_hang);

        chiTietAllOrder.forEach((chiTiet: any) => {
            const product = this.products.find((item: any) => item.ten_san_pham === chiTiet.ten_san_pham);

            if (product && product.gia_nhap !== undefined) {
                const loiNhuan = (chiTiet.tong_tien - product.gia_nhap) * chiTiet.so_luong;
                this.tongLoiNhuan += loiNhuan;
            }
        });
      }


  });
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
    console.log("CHECK zzz", order);
    this.showOrder = this.showAllOrder.filter((orderItem: any) => orderItem.id_don_hang === order.id_don_hang);
    console.log("CHECK showOrder", this.showOrder);
    this.selectedOrder = order; // Lưu thông tin đơn hàng đã chọn
    this.isOrderDetailModalOpen = true;
  }

  updateOrderStatus(order: any) {
    const payload = {
      id_don_hang: order.id_don_hang,
      trang_thai: order.trang_thai
    };

    this.http.post('http://localhost:3000/api/orders/update-order', payload)
      .subscribe(
        (response: any) => {
          if (response.status === "success") {
            alert(response.message);
            this.loadOrders(); // Tải lại danh sách đơn hàng sau khi cập nhật trạng thái
          }
        },
        (error) => {
          console.error("Lỗi khi gọi API:", error);
        }
      );
  }

  closeOrderDetailModal() {
    this.isOrderDetailModalOpen = false; // Đóng modal
    this.selectedOrder = null; // Reset thông tin đơn hàng
  }

  printOrder() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredOrders);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    // Tạo tên file Excel
    const fileName = 'don_hang_' + new Date().toISOString() + '.xlsx';

    // Xuất file
    XLSX.writeFile(wb, fileName);
    // Cách đơn giản để in chi tiết đơn hàng là mở cửa sổ in trình duyệt
    // window.print();
  }

  // Trong component TypeScript
  getTotalAmount(): number {
    return this.showOrder.reduce((total: number, product: any) => {
      const productTotal = parseFloat(product.tong_tien);
      return total + (isNaN(productTotal) ? 0 : productTotal);
    }, 0);
  }

  exportToExcel() {
    const filteredOrders = this.filteredOrders;

    // Map the filteredOrders to the expected format
    const mappedOrders = filteredOrders.map(order => ({
      'Mã đơn hàng': order.id_don_hang,          // Map order number to 'Mã đơn hàng'
      'Họ và tên': order.ho_va_ten,               // Map full name to 'Họ và tên'
      'Địa chỉ': order.dia_chi,                  // Map address to 'Địa chỉ'
      'Số điện thoại': order.so_dien_thoai,        // Map phone number to 'Số điện thoại'
      'Trạng thái đơn hàng': order.trang_thai === 'cho_xu_ly' ? 'Chờ xử lý': order.trang_thai === 'dang_giao' ? 'Đang giao hàng' : order.trang_thai === 'da_xac_nhan' ? 'Đã xác nhận' : order.trang_thai === 'da_giao' ? 'Đã giao' : order.trang_thai === 'da_huy' ? 'Đã hủy' : order.trang_thai,       // Map order status to 'Trạng thái đơn hàng'
      'Ngày mua': order.ngay_mua.split('T')[0],            // Map purchase date to 'Ngày mua'
      // 'Tổng tiền': order.tong_tien             // Map total amount to 'Tổng tiền'
    }));
    console.log("CHECK order", mappedOrders)

    // Create a worksheet with the mapped data
    const ws = XLSX.utils.json_to_sheet(mappedOrders, {
      header: ['Mã đơn hàng', 'Họ và tên', 'Địa chỉ', 'Số điện thoại', 'Trạng thái đơn hàng', 'Ngày mua'],
    });

    // Apply bold style to the header
    const rangeRef = ws['!ref'];
    if (rangeRef) {
      const range = XLSX.utils.decode_range(rangeRef); // Get the range of the worksheet
      for (let col = range.s.c; col <= range.e.c; col++) {
        const headerCell = ws[XLSX.utils.encode_cell({ r: 0, c: col })]; // Get the header cell
        if (headerCell) {
          headerCell.s = {
            font: { bold: true }, // Set font style to bold
          };
        }
      }
    }

    // Adjust the width of the columns
    ws['!cols'] = [
      { wch: 12 }, // 'Mã đơn hàng' width
      { wch: 20 }, // 'Họ và tên' width
      { wch: 25 }, // 'Địa chỉ' width
      { wch: 12 }, // 'Số điện thoại' width
      { wch: 20 }, // 'Trạng thái đơn hàng' width
      { wch: 10 }, // 'Ngày mua' width
    ];

    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    // Export the workbook to an Excel file
    XLSX.writeFile(wb, 'Thống kê đơn hàng.xlsx');
  }



  // Bổ sung phương thức cho tính năng mới nếu cần
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'tat_ca';
    this.startDate = null;
    this.endDate = null;
    this.applyFilters();
  }
}
