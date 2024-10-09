// src/app/models/user.model.ts

export interface User {
  id: number;
  ten_dang_nhap: string;
  ho_va_ten : string;
  email: string;
  dia_chi?: string;
  so_dien_thoai?: string;
  vai_tro: 'nguoi_dung' | 'quan_tri';
  ngay_tao: string;
}
