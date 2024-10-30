import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from './cart.service';
import { HttpClient } from '@angular/common/http';
import { OrderItem } from '../../models/order-item.model';

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
  constructor(
    private cartService: CartService,
    private http: HttpClient,
  ) { }


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
  onBuyNow() {
    // Lọc các sản phẩm được chọn
    // this.selectedItemsBuy = this.cartItems.filter(item => item.isSelected);

    for (let item of this.selectedItemsBuy) {
      const id_nguoi_dung = this.user && !isNaN(Number(this.user.id_nguoi_dung))
        ? Number(this.user.id_nguoi_dung)
        : 0;

      // Tạo đối tượng đơn hàng cho từng sản phẩm được chọn
      const orderItem: OrderItem = {
        id_nguoi_dung,
        ho_va_ten: this.user.ho_va_ten,
        so_dien_thoai: this.user.so_dien_thoai,
        dia_chi: this.user.dia_chi,
        ten_san_pham: item.ten_san_pham,  // Lấy thuộc tính từ item
        anh_san_pham: item.anh_san_pham,
        mau_sac: item.mau_sac,
        kich_thuoc: item.kich_thuoc,
        don_gia: Number(item.don_gia),
        so_luong: item.so_luong,
        tong_tien: Number(item.don_gia) * item.so_luong,
      };

      const apiUrl = 'http://localhost/api/orders/add-order.php';
      this.http.post(apiUrl, orderItem).subscribe(
        (response: any) => {
          // Kiểm tra mã trạng thái phản hồi
          if (response.status === 200 || response.status === 201) {
            alert(response.message);
            window.location.reload();  // Tải lại trang
          } else {
            alert(response.message);
            // window.location.reload();
          }
        },
        (error) => {
          alert('Đã có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
        }
      );
    }
  }


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
