import { Component } from '@angular/core';
import { DiscountCodeService } from './vouchers.service';
import { response } from 'express';

export interface DiscountCode {
  ma_giam_gia: string;
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
    const existingCode = this.filteredDiscountCodes.find((code: any) => code.ma_giam_gia === this.newDiscountCode);

    if (existingCode) {
        alert("Mã giảm giá đã tồn tại");
        return;
    }

    const newCode: DiscountCode = {
        ma_giam_gia: this.newDiscountCode,
        phan_tram_giam: this.newDiscountPercentage!,
        ngay_bat_dau: this.newStartDate,
        ngay_het_han: this.newExpirationDate,
        trang_thai: this.isActive
    };

    this.discountCodeService.addDiscountCode(newCode).subscribe(
      (response: any) => {
          if (response.status === 'success') {
            this.loadDiscountCodes();
            this.newDiscountCode = '';
            this.newDiscountPercentage = null;
            this.newStartDate = '';
            this.newExpirationDate = '';
            this.isActive = true;
            alert(response.message)
          }
      },
      (error) => {
        alert(error.message)
      })

}

  onSearchChange(): void {
    this.filteredDiscountCodes = this.discountCodes.filter((code) =>
      code.ma_giam_gia.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  deleteDiscountCode(ma_giam_gia: string): void {
    this.discountCodeService.deleteDiscountCode(ma_giam_gia).subscribe(() => {
      this.loadDiscountCodes();
    });
  }

  toggleActiveStatus(code: DiscountCode): void {
    code.trang_thai = !code.trang_thai;
    this.discountCodeService.updateDiscountCode(code).subscribe(
        response => {
          if(response.status === "success"){
            alert(response.message)
          }
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
