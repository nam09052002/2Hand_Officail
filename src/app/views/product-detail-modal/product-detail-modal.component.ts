import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model'; // Import model sản phẩm
import { CartItem } from '../../models/cart-item.model';
import { OrderItem } from '../../models/order-item.model';

@Component({
  selector: 'app-product-detail-modal',
  templateUrl: './product-detail-modal.component.html',
  styleUrls: ['./product-detail-modal.component.css']
})
export class ProductDetailModalComponent {
  @Input() product!: Product; // Nhận sản phẩm từ component cha
  isOpen = true; // Biến để theo dõi trạng thái của modal
  @Output() closeModal = new EventEmitter<void>();
  @Output() addCart = new EventEmitter<CartItem>();
  @Output() onBuyNow = new EventEmitter<OrderItem>();

  selectedColor: string | null = null; // Lưu trữ màu đã chọn (chỉ cho phép chọn một màu)
  selectedSize: string | null = null; // Lưu trữ kích thước đã chọn
  quantity: number = 1; // Số lượng sản phẩm
  user: any = null; // Dữ liệu người dùng
  mauSacArray: string[] = [];
  kichThuocArray: string[] = [];
  soLuongMauSac: number = 0; // Biến để lưu số lượng màu sắc khác nhau
  soLuongKichThuoc: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    console.log("CHECK AA", this.user);
    this.convertMauSacToArray();
    this.countUniqueColors();
    this.convertSizeToArray();
    this.countUniqueSizes();
  }

  convertSizeToArray() {
    if (Array.isArray(this.product.kich_thuoc)) {
      this.kichThuocArray = this.product.kich_thuoc.map(color => color.toUpperCase()); // Chuyển tất cả thành chữ hoa
    } else if (typeof this.product.kich_thuoc === 'string') {
      this.kichThuocArray = this.product.kich_thuoc.split(',').map(color => {
        return color.trim().toUpperCase(); // Chuyển tất cả thành chữ hoa
      });
    }
  }

  countUniqueSizes() {
    const uniqueColors = new Set(this.kichThuocArray);
    this.soLuongKichThuoc = uniqueColors.size;
  }

  convertMauSacToArray() {
    if (Array.isArray(this.product.mau_sac)) {
      this.mauSacArray = this.product.mau_sac.map(color => color.charAt(0).toUpperCase() + color.slice(1).toLowerCase());
    } else if (typeof this.product.mau_sac === 'string') {
      this.mauSacArray = this.product.mau_sac.split(',').map(color => {
        const trimmedColor = color.trim();
        return trimmedColor.charAt(0).toUpperCase() + trimmedColor.slice(1).toLowerCase();
      });
    }
  }

  countUniqueColors() {
    const uniqueColors = new Set(this.mauSacArray);
    this.soLuongMauSac = uniqueColors.size; // Đếm số lượng màu sắc khác nhau
  }

  toggleColor(color: string) {
    this.selectedColor = color; // Lưu màu đã chọn
  }

  toggleSize(size: string) {
    this.selectedSize = size // Lưu kích thước đã chọn
  }

  increaseQuantity() {
    this.quantity++; // Tăng số lượng
  }

  decreaseQuantity() {
    if (this.quantity > 1) { // Đảm bảo số lượng không giảm xuống dưới 1
      this.quantity--;
    }
  }

  onCloseModal() {
    this.isOpen = false; // Đặt trạng thái modal thành đóng
    this.closeModal.emit(); // Gửi sự kiện đóng modal
  }

  addToCart() {
    if (!this.selectedColor) {
      this.showAlert('Vui lòng chọn màu sắc!'); // Hiển thị cảnh báo
      return; // Dừng hàm nếu không hợp lệ
    }
    if (!this.selectedSize) {
      this.showAlert('Vui lòng chọn kích thước!'); // Hiển thị cảnh báo
      return; // Dừng hàm nếu không hợp lệ
    }
    if (this.product) {
      const id_nguoi_dung = this.user && !isNaN(Number(this.user.id_nguoi_dung))
        ? Number(this.user.id_nguoi_dung)
        : 0;

      const cartItem: CartItem = {
        id_nguoi_dung,
        id_san_pham: this.product.id_san_pham,
        anh_san_pham: this.product.anh_san_pham,
        mau_sac: this.selectedColor, // Lưu màu đã chọn
        kich_thuoc: this.selectedSize,// Lưu kích thước đã chọn
        don_gia: Number(this.product.gia_ban),
        so_luong: this.quantity,
      };

      this.addCart.emit(cartItem); // Phát sự kiện thêm vào giỏ hàng
    }
  }

  private showAlert(message: string) {
    alert(message); // Hàm hiển thị cảnh báo
  }
}
