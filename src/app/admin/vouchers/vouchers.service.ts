import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountCodeService {
  private apiUrl = 'http://localhost:3000/api/vouchers'; // Địa chỉ API của bạn

  constructor(private http: HttpClient) {}

  // Lấy tất cả mã giảm giá
  getDiscountCodes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-voucher`);
  }

  // Thêm mã giảm giá mới
  addDiscountCode(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-voucher`, data);
  }

  updateDiscountCode(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-voucher`, data);
  }

  // Xóa mã giảm giá
  deleteDiscountCode(ma_giam_gia: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-voucher`, {
      body: {
        ma_giam_gia: ma_giam_gia
      }
    });
  }
}
