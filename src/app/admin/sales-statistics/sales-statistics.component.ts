import { Component } from '@angular/core';
interface Order {
  id: number; // STT
  orderCode: string; // Mã đơn hàng
  customerName: string; // Tên khách hàng
  address: string; // Địa chỉ
  phoneNumber: string; // Số điện thoại
  status: string; // Trạng thái đơn hàng
  date: Date; // Ngày mua
  totalAmount: number; // Tổng tiền
}

@Component({
  selector: 'app-sales-statistics',
  templateUrl: './sales-statistics.component.html',
  styleUrl: './sales-statistics.component.css'
})
export class SalesStatisticsComponent {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm: string = '';
  selectedStatus: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  statuses: string[] = ['Tất cả', 'Đang xử lý', 'Đã giao', 'Đã hủy'];

  constructor() {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    // Giả lập dữ liệu đơn hàng
    this.orders = [
      { id: 1, orderCode: 'DH001', customerName: 'Nguyễn Văn A', address: '123 Đường 1', phoneNumber: '0123456789', status: 'Đang xử lý', date: new Date('2024-10-01'), totalAmount: 500000 },
      { id: 2, orderCode: 'DH002', customerName: 'Trần Thị B', address: '456 Đường 2', phoneNumber: '0987654321', status: 'Đã giao', date: new Date('2024-10-02'), totalAmount: 300000 },
      { id: 3, orderCode: 'DH003', customerName: 'Lê Văn C', address: '789 Đường 3', phoneNumber: '0112233445', status: 'Đã hủy', date: new Date('2024-10-03'), totalAmount: 100000 },
      { id: 4, orderCode: 'DH004', customerName: 'Phạm Thị D', address: '321 Đường 4', phoneNumber: '0223344556', status: 'Đang xử lý', date: new Date('2024-10-04'), totalAmount: 750000 },
      // Thêm nhiều đơn hàng giả lập khác
    ];
    this.filteredOrders = [...this.orders];
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearchTerm = order.customerName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus ? order.status === this.selectedStatus : true;
      const matchesDate =
        (!this.startDate || order.date >= this.startDate) &&
        (!this.endDate || order.date <= this.endDate);

      return matchesSearchTerm && matchesStatus && matchesDate;
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
}
