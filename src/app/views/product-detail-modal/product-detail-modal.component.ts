import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model'; // Import model sản phẩm
import { CartItem } from '../../models/cart-item.model';
import { OrderItem } from '../../models/order-item.model';

@Component({
  selector: 'app-product-detail-modal',
  templateUrl: './product-detail-modal.component.html',
  styleUrl: './product-detail-modal.component.css'
})
export class ProductDetailModalComponent {
  @Input() product!: Product; // Nhận sản phẩm từ component cha
  isOpen = true; // Biến để theo dõi trạng thái của modal
  @Output() closeModal = new EventEmitter<void>();
  @Output() addCart = new EventEmitter<CartItem>();
  @Output() onBuyNow = new EventEmitter<OrderItem>();

  selectedColor: string | null = null; // Lưu trữ màu đã chọn
  selectedSize: string | null = null; // Lưu trữ kích thước đã chọn
  availableColors = ['Đỏ', 'Xanh', 'Vàng', 'Đen']; // Danh sách màu sắc
  availableSizes = ['S', 'M', 'L', 'XL']; // Danh sách kích thước
  quantity: number = 1;
  user: any = null;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    console.log("CHECK AA", this.user)
  }


  // Hàm toggle cho màu sắc
  toggleColor(color: string) {
    this.selectedColor = (this.selectedColor === color) ? null : color; // Lưu màu đã chọn
  }

  // Hàm toggle cho kích thước
  toggleSize(size: string) {
    this.selectedSize = (this.selectedSize === size) ? null : size; // Lưu kích thước đã chọn
  }

  increaseQuantity() {
    this.quantity++; // Tăng số lượng
  }

  decreaseQuantity() {
    if (this.quantity > 1) { // Đảm bảo số lượng không giảm xuống dưới 1
        this.quantity--;
    }
  }

  open(product: Product) {
    this.product = product;
    this.isOpen = true;
  }

  onCloseModal() {
    this.isOpen = false; // Đặt trạng thái modal thành đóng
    this.closeModal.emit(); // Gửi sự kiện đóng modal
  }

  addToCart() {
    if (!this.selectedColor) {
      alert('Vui lòng chọn màu sắc!'); // Hiển thị cảnh báo
      return; // Dừng hàm nếu không hợp lệ
    }
    if (!this.selectedSize) {
      alert('Vui lòng chọn kích thước!'); // Hiển thị cảnh báo
      return; // Dừng hàm nếu không hợp lệ
    }
    if (this.product) {
      const id_nguoi_dung = this.user && !isNaN(Number(this.user.id_nguoi_dung))
        ? Number(this.user.id_nguoi_dung)
        : 0;
      const cartItem: CartItem = {
        id_nguoi_dung ,
        id_san_pham: this.product.id_san_pham,
        anh_san_pham: this.product.anh_san_pham,
        mau_sac: this.selectedColor || '', // Lưu màu đã chọn
        kich_thuoc: this.selectedSize || '', // Lưu kích thước đã chọn
        don_gia: Number(this.product.gia_ban),
        so_luong: this.quantity,
      };
      this.addCart.emit(cartItem);
    }
  }

  buyNow() {
    if (!this.selectedColor) {
      alert('Vui lòng chọn màu sắc!'); // Hiển thị cảnh báo
      return; // Dừng hàm nếu không hợp lệ
    }
    if (!this.selectedSize) {
      alert('Vui lòng chọn kích thước!'); // Hiển thị cảnh báo
      return; // Dừng hàm nếu không hợp lệ
    }
    if (!this.user.ho_va_ten || !this.user.so_dien_thoai || !this.user.dia_chi ) {
      alert("Vui lòng cập nhật thông tin người dùng trước khi mua hàng!")
      return
    }
    if (this.product) {
      const id_nguoi_dung = this.user && !isNaN(Number(this.user.id_nguoi_dung))
        ? Number(this.user.id_nguoi_dung)
        : 0;
      const orderItem: OrderItem = {
        id_nguoi_dung,
        ho_va_ten: this.user.ho_va_ten,
        so_dien_thoai: this.user.so_dien_thoai,
        dia_chi: this.user.dia_chi,
        ten_san_pham: this.product.ten_san_pham,
        anh_san_pham: this.product.anh_san_pham,
        mau_sac: this.selectedColor,
        kich_thuoc: this.selectedSize,
        don_gia: Number(this.product.gia_ban),
        so_luong: this.quantity,
        tong_tien: Number(this.product.gia_ban) * this.quantity,
      }
      this.onBuyNow.emit(orderItem); // Phát sự kiện mua ngay
    }
  }
}
