// src/app/models/user.model.ts

export interface User {
  id_nguoi_dung: number;
  ten_dang_nhap: string;
  ho_va_ten : string;
  email: string;
  dia_chi?: string;
  so_dien_thoai?: string;
  vai_tro: 'user' | 'admin';
  ngay_tao: string;
  mat_khau?: string;
}
