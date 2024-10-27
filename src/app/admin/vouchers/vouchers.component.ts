import { Component } from '@angular/core';
import { DiscountCodeService } from './vouchers.service';

export interface DiscountCode {
  id: number;
  ma_giam: string;
  phan_tram_giam: number;
  ngay_bat_dau: string;
  ngay_het_han: string;
  trang_thai: boolean;
}

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.component.html',
  styleUrl: './vouchers.component.css'
})
export class VouchersComponent {
  discountCodes: DiscountCode[] = []; // Thêm kiểu DiscountCode[]
  filteredDiscountCodes: DiscountCode[] = [];
  newDiscountCode = '';
  newDiscountPercentage: number | null = null;
  newStartDate = '';
  newExpirationDate = '';
  isActive = true;
  searchQuery = '';

  constructor(private discountCodeService: DiscountCodeService) {}

  ngOnInit(): void {
    this.loadDiscountCodes();
  }

  loadDiscountCodes(): void {
    this.discountCodeService.getDiscountCodes().subscribe(
      (response: any) => { // Thay đổi DiscountCode[] thành any
        // Kiểm tra xem response có thuộc tính data và thuộc tính đó có phải là mảng không
        if (response && response.status === 'success' && Array.isArray(response.data)) {
          this.discountCodes = response.data; // Gán mảng mã giảm giá
          this.filteredDiscountCodes = [...this.discountCodes]; // Khởi tạo danh sách đã lọc
        } else {
          console.error('API không trả về mảng:', response);
          this.discountCodes = []; // Thiết lập discountCodes về mảng rỗng
          this.filteredDiscountCodes = [];
        }
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
        this.discountCodes = [];
        this.filteredDiscountCodes = [];
      }
    );
  }



  addDiscountCode(): void {
    const newCode: DiscountCode = {
      id: 0, // Nếu ID tự động tạo từ server, có thể bỏ qua hoặc để mặc định là 0
      ma_giam: this.newDiscountCode,
      phan_tram_giam: this.newDiscountPercentage!,
      ngay_bat_dau: this.newStartDate,
      ngay_het_han: this.newExpirationDate,
      trang_thai: this.isActive
    };

    this.discountCodeService.addDiscountCode(newCode).subscribe(() => {
      this.loadDiscountCodes();
      this.newDiscountCode = '';
      this.newDiscountPercentage = null;
      this.newStartDate = '';
      this.newExpirationDate = '';
      this.isActive = true;
    });
  }

  onSearchChange(): void {
    this.filteredDiscountCodes = this.discountCodes.filter((code) =>
      code.ma_giam.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  deleteDiscountCode(id: number): void {
    this.discountCodeService.deleteDiscountCode(id).subscribe(() => {
      this.loadDiscountCodes();
    });
  }

  toggleActiveStatus(code: DiscountCode): void {
    code.trang_thai = !code.trang_thai;
    this.discountCodeService.updateDiscountCode(code).subscribe(
        response => {
            console.log('Cập nhật trạng thái thành công:', response);
            // Có thể thêm logic thông báo cho người dùng hoặc cập nhật lại danh sách nếu cần
        },
        error => {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            // Khôi phục lại trạng thái ban đầu nếu có lỗi
            code.trang_thai = !code.trang_thai; // Đảo ngược lại để phục hồi
            alert('Đã xảy ra lỗi khi cập nhật trạng thái. Vui lòng thử lại.');
        }
    );

    // Gọi API để cập nhật trạng thái nếu có
  }
}
