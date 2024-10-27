import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css']
})
export class CartModalComponent {
  isCheckout = false;
  selectedItemsBuy: any[] = [];
  // cartItems: any[] = [];
  errorMessage: string = '';
  user: any = null;


  @Input() isOpen: boolean = false; // Trạng thái mở/đóng modal
  @Input() cartItems: any[] = []; // Danh sách sản phẩm trong giỏ hàng
  @Output() close = new EventEmitter<void>();
  @Output() removeItem = new EventEmitter<CartItem>();
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    // this.loadCart(this.user.id_nguoi_dung);
  }

  // loadCart(id_nguoi_dung: number): void {
  //   this.cartService.getCart(id_nguoi_dung).subscribe(
  //     (response) => {
  //       if (response.success) {
  //         this.cartItems = response.data || [];
  //         console.log("NAM", this.cartItems)
  //       } else {
  //         this.errorMessage = response.message;
  //       }
  //     },
  //     (error) => {
  //       console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
  //       this.errorMessage = 'Đã có lỗi xảy ra khi lấy thông tin giỏ hàng.';
  //     }
  //   );
  // }


  closeCart() {
    // Logic để đóng modal
    this.isOpen = false;
    this.close.emit(); // Thay đổi trạng thái
  }
  backToCart(){
    this.isCheckout = false;
  }
  onBuyNow(){}

  onCheckout() {
    this.selectedItemsBuy = [];
    const selectedItems = this.cartItems.filter(item => item.isSelected);
    if (selectedItems.length > 0) {
      this.selectedItemsBuy = selectedItems
      console.log("CHECK this.selectedItemsBuy", this.selectedItemsBuy)
      this.isCheckout = true;
        // Thực hiện thanh toán với selectedItems
        console.log('Đang thanh toán cho các sản phẩm:', selectedItems);
    } else {
        alert('Vui lòng chọn sản phẩm để thanh toán.');
    }
}


  onRemoveItem(item: CartItem) {
    if (item.id_gio_hang !== undefined) {
      this.cartService.deleteCartItem(item.id_gio_hang).subscribe(
        response => {
          if (response.status === "success") {
            alert(response.message)
            this.cartItems = this.cartItems.filter(cartItem => cartItem.id_gio_hang !== item.id_gio_hang);
            this.removeItem.emit(item);
          } else {
            alert(response.message);
          }
        },
        error => {
          console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
          alert('Đã có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng.');
        }
      );
    } else {
      console.error('ID giỏ hàng không hợp lệ.');
      alert('ID giỏ hàng không hợp lệ.');
    }
     // Phát sự kiện với sản phẩm cần xóa
  }

}
