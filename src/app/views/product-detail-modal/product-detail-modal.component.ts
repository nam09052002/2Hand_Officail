import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-detail-modal',
  templateUrl: './product-detail-modal.component.html',
  styleUrl: './product-detail-modal.component.css'
})
export class ProductDetailModalComponent {
  @Input() product: any; // Nhận sản phẩm từ component cha
  isOpen = false; // Biến để theo dõi trạng thái của modal
  @Output() closeModal = new EventEmitter<void>();
  @Output() addCart = new EventEmitter<void>();


  open(product: any) {
    this.product = product; // Gán sản phẩm khi mở modal
    this.isOpen = true; // Mở modal
  }

  onCloseModal() {
    console.log("CLOSE")
    this.closeModal.emit(); // Gửi sự kiện đóng modal
  }

  addToCart(product: any) {
    // Logic thêm sản phẩm vào giỏ hàng
    console.log('Đã thêm vào giỏ hàng:', product);
    this.addCart.emit();
  }

  buyNow(product: any) {
      // Logic để mua ngay sản phẩm
      console.log('Mua ngay sản phẩm:', product);
  }
}
