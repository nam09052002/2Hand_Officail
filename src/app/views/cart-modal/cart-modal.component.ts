import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from './cart.service';
import { HttpClient } from '@angular/common/http';
import { OrderItem } from '../../models/order-item.model';
import { ProductService } from '../../admin/management-products/management-products.service';
import { ApiProductResponse, Product } from '../../models/product.model';
import { Vouchers } from '../../models/vouchers.model';

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
  products: Product[] = [];
  filteredProducts: Product[] = [];
  ma_giam_gia: string = '';
  totalAmount: number = 0;
  vouchers: Vouchers[] = []


  @Input() isOpen: boolean = false; // Trạng thái mở/đóng modal
  @Input() cartItems: any[] = []; // Danh sách sản phẩm trong giỏ hàng
  @Output() close = new EventEmitter<void>();
  @Output() removeItem = new EventEmitter<CartItem>();
  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private productService: ProductService,
  ) { }


  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.fetchProducts();
    this.loadVoucher();
  }

  loadVoucher(){
    this.http.get('http://localhost/api/vouchers/get-voucher.php').subscribe(
      (response: any) => {
        if (response.status === "success") {

          const ngayHomNay = new Date()
          this.vouchers = response.data.filter(
            (voucher:any) => voucher.trang_thai = true && new Date(voucher.ngay_het_han) >= ngayHomNay
          )
        }
      },
      (error) => {
        //
      }
    )
  }

  fetchProducts() {
    this.productService.getProducts().subscribe(
      (data: ApiProductResponse) => {

        if (data && data.products) {
          const baseUrl = 'http://localhost/api/'; // Địa chỉ cơ sở
          this.products = data.products
          .filter(product => (product.ton_kho ?? 0) > 0)
          .map(product => ({
            ...product,
            anh_san_pham: `${baseUrl}${product.anh_san_pham}`
          }))
          .sort((a, b) => (b.da_ban ?? 0) - (a.da_ban ?? 0));
        // this.filteredProducts = [...this.products];
        } else {
          console.error("Không có sản phẩm nào được tìm thấy");
          this.products = []; // Đặt sản phẩm thành mảng rỗng nếu không có
        }
      },
      error => {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    );
  }

  applyDiscount() {
    const voucher = this.vouchers.find((voucher: any) => voucher.ma_giam_gia === this.ma_giam_gia);
    if (voucher) {
      this.totalAmount = this.calculateTotalAmount() - (this.calculateTotalAmount() * voucher.phan_tram_giam / 100);
  } else if(this.ma_giam_gia = ''){
    this.totalAmount = this.calculateTotalAmount()

  } else {
    this.totalAmount = this.calculateTotalAmount()
    alert("Mã giảm giá không hợp lệ!")
    }
  }


  closeCart() {
    // Logic để đóng modal
    this.isOpen = false;
    this.close.emit(); // Thay đổi trạng thái
  }
  backToCart(){
    this.isCheckout = false;
  }
  onBuyNow() {
    this.selectedItemsBuy = this.cartItems.filter(item => item.isSelected);

    if (this.selectedItemsBuy.length === 0) {
        alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
        return;
    }

    const id_nguoi_dung = this.user && !isNaN(Number(this.user.id_nguoi_dung))
        ? Number(this.user.id_nguoi_dung)
        : 0;

    const voucher = this.vouchers.find((voucher: any) => voucher.ma_giam_gia === this.ma_giam_gia);

    const orderItems = this.selectedItemsBuy.map(item => {
        return {
            ten_san_pham: item.ten_san_pham,
            anh_san_pham: item.anh_san_pham,
            mau_sac: item.mau_sac,
            kich_thuoc: item.kich_thuoc,
            don_gia: Number(item.don_gia),
            so_luong: item.so_luong,
            ma_giam_gia: voucher?.ma_giam_gia,
            phan_tram_giam: voucher?.phan_tram_giam,
            tong_tien: (Number(item.don_gia) * item.so_luong) - (Number(item.don_gia) * item.so_luong * (voucher?.phan_tram_giam ?? 0) / 100),
        };
    });

    const order = {
        id_nguoi_dung,
        ho_va_ten: this.user.ho_va_ten,
        so_dien_thoai: this.user.so_dien_thoai,
        dia_chi: this.user.dia_chi,
        orderItems // Đưa mảng sản phẩm vào đơn hàng
    };

    const apiUrl = 'http://localhost/api/orders/add-order.php';
    this.http.post(apiUrl, order).subscribe(
        (response: any) => {
            // Kiểm tra mã trạng thái phản hồi
            if (response.status === 200 || response.status === 201) {
                alert(response.message);
                this.updateProduct(orderItems); // Cập nhật sản phẩm
                this.selectedItemsBuy.forEach(item => this.onRemoveItem(item)); // Xóa tất cả sản phẩm khỏi giỏ hàng
                window.location.reload(); // Tải lại trang nếu cần
            } else {
                alert(response.message);
                this.updateProduct(orderItems);
                this.selectedItemsBuy.forEach(item => this.onRemoveItem(item)); // Xóa tất cả sản phẩm khỏi giỏ hàng
                window.location.reload();
            }
        },
        (error) => {
            alert('Đã có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
        }
    );
}

//   async updateProduct(oderItem: any) {
//     try {
//         await this.fetchProducts(); // Đảm bảo lấy danh sách sản phẩm mới

//         const updateProduct = this.products.find(i =>
//           i.ten_san_pham === oderItem.ten_san_pham
//         );

//         if (!updateProduct) {
//             alert("Sản phẩm không tìm thấy!");
//             return;
//         }

//         const params = {
//             id_san_pham: updateProduct.id_san_pham,
//             ten_san_pham: updateProduct.ten_san_pham,
//             anh_san_pham: updateProduct.anh_san_pham,
//             mo_ta: updateProduct.mo_ta,
//             ten_gioi_tinh: updateProduct.ten_gioi_tinh,
//             ten_danh_muc: updateProduct.ten_danh_muc,
//             ten_nhan_hieu: updateProduct.ten_nhan_hieu,
//             ten_nha_cung_cap: updateProduct.ten_nha_cung_cap,
//             gia_nhap: updateProduct.gia_nhap,
//             gia_ban: updateProduct.gia_ban,
//             da_ban: (updateProduct.da_ban ?? 0) + oderItem.so_luong,
//             ton_kho: (updateProduct.ton_kho ?? 0) - oderItem.so_luong
//         };

//         const response: any = await this.http.post('http://localhost/api/management-products/update-product.php', params).toPromise();

//         if (response.status === "success") {
//             //
//         } else {
//             //
//         }
//     } catch (error) {
//         //
//     }
// }

async updateProduct(orderItems: any[]) {
  try {
      await this.fetchProducts(); // Fetch the current list of products

      for (let orderItem of orderItems) {
          // Find the product in the current list of products
          const updateProduct = this.products.find(product =>
              product.ten_san_pham === orderItem.ten_san_pham
          );

          if (!updateProduct) {
            continue;
          }


          const params = {
            id_san_pham: updateProduct.id_san_pham,
            ten_san_pham: updateProduct.ten_san_pham,
            anh_san_pham: updateProduct.anh_san_pham,
            mo_ta: updateProduct.mo_ta,
            ten_gioi_tinh: updateProduct.ten_gioi_tinh,
            ten_danh_muc: updateProduct.ten_danh_muc,
            ten_nhan_hieu: updateProduct.ten_nhan_hieu,
            ten_nha_cung_cap: updateProduct.ten_nha_cung_cap,
            gia_nhap: updateProduct.gia_nhap,
            gia_ban: updateProduct.gia_ban,
            da_ban: (updateProduct.da_ban ?? 0) + orderItem.so_luong,
            ton_kho: (updateProduct.ton_kho ?? 0) - orderItem.so_luong
          };

          // Send an HTTP request to update the product quantity in the database
          await this.http.post('http://localhost/api/management-products/update-product.php', params).toPromise();
      }

    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng sản phẩm:', error);
    }
  }



  onCheckout() {
    this.selectedItemsBuy = [];
    const selectedItems = this.cartItems.filter(item => item.isSelected);
    if (selectedItems.length > 0) {
      this.selectedItemsBuy = selectedItems
      this.totalAmount = this.calculateTotalAmount();
      console.log("CHECK this.selectedItemsBuy", this.selectedItemsBuy)
      this.isCheckout = true;
        // Thực hiện thanh toán với selectedItems
        console.log('Đang thanh toán cho các sản phẩm:', selectedItems);
    } else {
        alert('Vui lòng chọn sản phẩm để thanh toán.');
    }
}
  calculateTotalAmount() {
    return this.selectedItemsBuy.reduce((sum, item) => {
      // Chuyển đổi tong_tien thành số, nếu không có giá trị thì mặc định là 0
      const itemTotal = Number(item.tong_tien) || 0;
      return sum + itemTotal; // Cộng dồn tổng
  }, 0);  }


  onRemoveItem(item: CartItem) {
    console.log("CHECK 1", item)
    if (item.id_gio_hang !== undefined) {
      this.cartService.deleteCartItem(item.id_gio_hang).subscribe(
        response => {
          if (response.status === "success") {
            // alert(response.message)
            alert("Cập nhật giỏ hàng thành công")
            this.cartItems = this.cartItems.filter(cartItem => cartItem.id_gio_hang !== item.id_gio_hang);
            this.removeItem.emit(item);
          } else {
            // alert(response.message);
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
