import { CartItem } from "./cart-item.model";

export interface OrderItem extends CartItem{
  ho_va_ten?: string;
  so_dien_thoai?: number;
  dia_chi?: string;
  ma_giam_gia?: string;
  phan_tram_giam?: number;
}

