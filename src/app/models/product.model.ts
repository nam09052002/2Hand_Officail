export interface Product {
  id: number; // ID sản phẩm
  ten_san_pham: string; // Tên sản phẩm
  mo_ta?: string; // Mô tả sản phẩm
  gia_nhap: number; // Giá nhập
  gia_ban: number; // Giá bán
  so_luong: number; // Số lượng
  phan_loai_id: number; // ID phân loại sản phẩm
  gioi_tinh_id: number; // ID giới tính
  nhan_hieu_id: number; // ID nhãn hiệu
  nha_cung_cap_id: number; // ID nhà cung cấp
  anh_san_pham?: string; // Đường dẫn ảnh sản phẩm
  ngay_tao?: Date; // Ngày tạo sản phẩm
}
