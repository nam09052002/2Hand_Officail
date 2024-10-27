import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model'; // Import model sản phẩm
import { truncate } from 'node:fs';

@Component({
  selector: 'app-product-detail-modal',
  templateUrl: './product-detail-modal.component.html',
  styleUrl: './product-detail-modal.component.css'
})
export class ProductDetailModalComponent {
  @Input()
  product!: Product; // Nhận sản phẩm từ component cha
  isOpen = true; // Biến để theo dõi trạng thái của modal
  @Output() closeModal = new EventEmitter<void>();
  @Output() addCart = new EventEmitter<Product>(); // Phát sự kiện với kiểu dữ liệu Product
  @Output() onBuyNow = new EventEmitter<void>();

  constructor(private router: Router) {}

  // Hàm mở modal với sản phẩm cụ thể
  open(product: Product) {
    this.product = product; // Gán sản phẩm khi mở modal
    this.isOpen = true; // Mở modal
  }

  // Hàm đóng modal
  onCloseModal() {
    this.isOpen = false; // Đặt trạng thái modal thành đóng
    this.closeModal.emit(); // Gửi sự kiện đóng modal
  }

  // Hàm thêm sản phẩm vào giỏ hàng
  addToCart() {
    if (this.product) { // Kiểm tra xem sản phẩm có tồn tại không
      console.log('Đã thêm vào giỏ hàng:', this.product);
      this.addCart.emit(this.product); // Phát sự kiện với sản phẩm hiện tại
    }
  }

  // Hàm xử lý mua ngay
  buyNow() {
    if (this.product) { // Kiểm tra xem sản phẩm có tồn tại không
      console.log('Mua ngay sản phẩm:', this.product);
      this.onBuyNow.emit(); // Phát sự kiện mua ngay
      const user = JSON.parse(localStorage.getItem('user') || 'null');

      if (!user) {
        // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
        this.router.navigate(['/login']);
      } else {
        this.onCloseModal(); // Đóng modal nếu đã đăng nhập
        console.log('Thực hiện mua ngay:', this.product);
        // Thêm logic mua hàng tại đây (như thêm vào giỏ hàng, thanh toán, v.v.)
      }
    }
  }
}
