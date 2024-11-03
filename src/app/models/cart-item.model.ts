import { Product } from "./product.model";

export interface CartItem extends Product{
  // mau_sac?: string;
  // kich_thuoc?: string;
  don_gia?: number;
  so_luong?: number;
  id_nguoi_dung?: number;
  tong_tien? : number;
  id_gio_hang? : number;
}
