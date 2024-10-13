export interface Product {
  id: number;
  ten_san_pham: string;
  mo_ta?: string;
  gia_nhap: number;
  gia_ban: number;
  so_luong: number;
  ten_loai: string;
  ten_gioi_tinh: string;
  ten_nhan_hieu: string;
  ten_nha_cung_cap: string;
  anh_san_pham: string | null;
  da_ban: number;
  ton_kho: number;
  ngay_tao?: Date;
}

export interface ApiProductResponse {
  message: string; // Thông điệp phản hồi
  products: Product[]; // Mảng sản phẩm
}