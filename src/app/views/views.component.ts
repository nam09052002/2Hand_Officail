import { Component, OnInit } from '@angular/core';
import { ApiProductResponse, Product } from '../models/product.model';
import { ProductService } from '../admin/management-products/management-products.service';
import { Router } from '@angular/router';
import { CartItem } from '../models/cart-item.model';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart-modal/cart.service';
import { OrderItem } from './../models/order-item.model';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.css']
})
export class ViewsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProductsCount = 18;
  showAllProducts = false;
  selectedProduct: any;
  isSelectedProduct?: boolean;
  searchTerm: string = '';
  cartCount = 0;
  user: any = null;
  isOpenModalCart = false;
  cartItems: CartItem[] = [];
  isHovered: boolean = false;
  errorMessage: string = '';
  menDropdown  = false;
  girlDropdown  = false;
  menCategories: string[] = [];
  girlCategories: string[] = [];
  menProducts: Product[] = [];
  girlProducts: Product[] = [];
  isMenProduct = true;
  isGirlProduct = true;
  isAdmin = false;
  isVoucherModalVisible = false;
  isChatModalOpen = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private http: HttpClient,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.isSelectedProduct = false;
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    if (this.user?.id_nguoi_dung) {
      this.loadCart(this.user.id_nguoi_dung);
    }
    if (this.user?.vai_tro === "admin"){
      this.isAdmin = true
    }
    // this.loadCart(this.user.id_nguoi_dung);
    this.getCatalog();
    this.menFashion();
    this.girlFashion();
  }
  getCatalog(){
    this.http.get('http://localhost:3000/api/product-catalog/get-catalog').subscribe(
        (response: any) => {
            if (response.status === 'success') {
              const categories = response.data;
              this.menCategories = categories.filter((item:any) => item.phan_loai === 'nam').map((item:any) => item.ten_danh_muc);
              this.girlCategories = categories.filter((item:any) => item.phan_loai === 'nu').map((item:any) => item.ten_danh_muc);
            }
        },
        (error) => {
            console.error('Lỗi khi lấy danh mục:', error);
        }
    );
  }

  fetchProducts() {
    this.isMenProduct = true;
    this.isGirlProduct = true;
    this.productService.getProducts().subscribe(
      (response: any) => {
        if (response.status === "success") {
          console.log("CHECK DATA", response.data);
          const baseUrl = 'http://localhost:3000/api'; // Địa chỉ cơ sở
          this.products = response.data
            .filter((product:any) => (product.ton_kho ?? 0) > 0)  // Kiểm tra tồn kho
            .map((product: any) => ({
              ...product,
              anh_san_pham: `${baseUrl}${product.anh_san_pham}`,
              mau_sac: Array.isArray(product.mau_sac)
                ? product.mau_sac.map((color: any) => color.charAt(0).toUpperCase() + color.slice(1).toLowerCase())
                : typeof product.mau_sac === 'string'
                  ? product.mau_sac.split(',').map((color: any) => {
                      const trimmedColor = color.trim();
                      return trimmedColor.charAt(0).toUpperCase() + trimmedColor.slice(1).toLowerCase();
                    })
                  : [],
              kich_thuoc: Array.isArray(product.kich_thuoc)
                ? product.kich_thuoc.map((kich_thuoc: any) => kich_thuoc.charAt(0).toUpperCase() + kich_thuoc.slice(1).toLowerCase())
                : typeof product.kich_thuoc === 'string'
                  ? product.kich_thuoc.split(',').map((kich_thuoc:any ) => {
                      const trimmedSize = kich_thuoc.trim();
                      return trimmedSize.charAt(0).toUpperCase() + trimmedSize.slice(1).toLowerCase();
                    })
                  : []
            }))
            .sort((a: any, b: any) => (b.da_ban ?? 0) - (a.da_ban ?? 0));

          if (this.products.length > 0) {
            this.filteredProducts = [...this.products];
            console.log("CHECK this.filteredProducts", this.filteredProducts);
          } else {
            console.error("Không có sản phẩm nào có tồn kho");
            this.products = [];
          }
        } else {
          console.error("Không có sản phẩm nào được tìm thấy hoặc dữ liệu không hợp lệ");
          this.products = [];
        }
      },
      (error) => {
      //
      }
    );
  }
  loadCart(id_nguoi_dung: number): void {
    this.cartService.getCart(id_nguoi_dung).subscribe(
      (response) => {
        if (response.status === "success") {
          this.cartItems = response.data || [];
          this.cartCount = this.cartItems.length;
        } else {
          this.errorMessage = response.message;
        }
      },
      (error) => {
        console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
        this.errorMessage = 'Đã có lỗi xảy ra khi lấy thông tin giỏ hàng.';
      }
    );
  }

  loadMoreProducts() {
    this.displayedProductsCount += 6; // Tăng số lượng sản phẩm hiển thị
  }

  hideProducts() {
    this.displayedProductsCount -= 6; // Giảm số lượng sản phẩm hiển thị
    this.showAllProducts = false; // Đặt trạng thái xem tất cả sản phẩm về false
  }

  openProductDetail(product: any) {
    console.log("CLICK");
    this.selectedProduct = product; // Gán sản phẩm được chọn
    this.isSelectedProduct = true;
  }

  onCloseModal() {
    console.log("Đóng modal sản phẩm");
    this.isSelectedProduct = false; // Đặt lại để ẩn modal
  }

  addToCart(cartItem: any) {
    if (!this.user){
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!")
      this.router.navigate(['/login']);
      return
    }
    const apiUrl = 'http://localhost:3000/api/carts/add-cart';
    this.http.post(apiUrl, cartItem).subscribe(
      (response: any) => {
        // Kiểm tra mã trạng thái phản hồi
        if (response.status === 200 || response.status === 201) {

          alert(response.message);
          this.onCloseModal(); // Đóng modal sau khi thêm sản phẩm
        } else {
          this.cartCount++
          this.loadCart(this.user.id_nguoi_dung);
          alert(response.message);
          this.onCloseModal();
        }
      },
      (error) => {
        alert('Đã có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
      }
    );


  }

  closeCart() {
    this.isOpenModalCart = false;
  }

  toggleCartModal() {
    if (this.cartCount === 0) {
      this.isOpenModalCart = false;
      alert("Bạn chưa thêm sản phẩm nào vào giỏ hàng!")
      return
    } else {
    this.isOpenModalCart = true;
    // this.cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]') || [];
    console.log("CHECK this.cartItems", this.cartItems);
    }

  }
  handleRemoveItem(item: CartItem) {
    console.log("CHECK sigtuaspugji")
    this.cartCount--;
    // alert(`Đã xóa sản phẩm: ${item.product.ten_san_pham}`);
    if (this.cartCount === 0) {
      this.isOpenModalCart = false;
    }
  }

  onSearch() {
    this.filteredProducts = this.products.filter(product =>
      product?.ten_san_pham?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product?.gia_ban?.toString().includes(this.searchTerm) // Tìm kiếm theo giá
    );
  }

  buyNow(oderItem: any) {
    if (!this.user){
      alert("Bạn chưa đăng nhập nên không thể mua sản phẩm!")
      this.router.navigate(['/login']);
      return
    }
    const apiUrl = 'http://localhost:3000/api/orders/add-order';
    this.http.post(apiUrl, oderItem).subscribe(
      (response: any) => {
        // Kiểm tra mã trạng thái phản hồi
        if (response.status === 200 || response.status === 201) {

          alert(response.message);
          this.updateProduct(oderItem);
          this.onCloseModal(); // Đóng modal sau khi thêm sản phẩm
          window.location.reload();

        } else {
          // this.cartCount++
          // this.loadCart(this.user.id_nguoi_dung);
          this.updateProduct(oderItem);
          alert(response.message);
          this.onCloseModal();
          window.location.reload();

        }
      },
      (error) => {
        alert('Đã có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
      }
    );

  }
  async updateProduct(oderItem: any) {
    try {
        await this.fetchProducts(); // Đảm bảo lấy danh sách sản phẩm mới

        const updateProduct = this.products.find(i => i.ten_san_pham === oderItem.ten_san_pham);

        if (!updateProduct) {
            alert("Sản phẩm không tìm thấy!");
            return;
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
            da_ban: (updateProduct.da_ban ?? 0) + 1,
            ton_kho: (updateProduct.ton_kho ?? 0) - 1
        };

        const response: any = await this.http.post('http://localhost:3000/api/management-products/update-product', params).toPromise();

        if (response.status === "success") {
            //
        } else {
            //
        }
    } catch (error) {
        //
    }
}

  menFashion(){
    this.productService.getProducts().subscribe(
      (response: any) => {
        if (response.status === "success") {
          const baseUrl = 'http://localhost:3000/api';
          this.products = response.data.map((product :any) => ({
            ...product,
            anh_san_pham: `${baseUrl}${product.anh_san_pham}`
          }));
          // Lọc sản phẩm có giới tính 'Nam' sau khi đã lấy dữ liệu thành công
          this.menProducts = this.products.filter(product => product.ten_gioi_tinh === "1");
        } else {
          console.error("Không có sản phẩm nào được tìm thấy");
          this.products = [];
        }
      },
      error => {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    );
  }
  girlFashion() {
    this.productService.getProducts().subscribe(
      (response: any) => {
        if (response.status === "success") {
          const baseUrl = 'http://localhost:3000/api';
          this.products = response.data.map((product: any) => ({
            ...product,
            anh_san_pham: `${baseUrl}${product.anh_san_pham}`
          }));
          // Lọc sản phẩm có giới tính 'Nam' sau khi đã lấy dữ liệu thành công
          this.girlProducts = this.products.filter(product => product.ten_gioi_tinh === '2');
        } else {
          console.error("Không có sản phẩm nào được tìm thấy");
          this.products = [];
        }
      },
      error => {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    );
  }
  menFashionItem(category: any) {
    this.isMenProduct = false;
    this.isGirlProduct = false;
    console.log("CHEKC ", category);
    this.productService.getProducts().subscribe(
      (response: any) => {
        if (response.status === "success") {
          const baseUrl = 'http://localhost:3000/api';
          this.products = response.data.map((product: any) => ({
            ...product,
            anh_san_pham: `${baseUrl}${product.anh_san_pham}`
          }));

          // In ra tất cả sản phẩm để kiểm tra
          console.log("Tất cả sản phẩm:", this.products);

          // Thử lọc dựa trên danh mục và giới tính
          this.filteredProducts = this.products.filter(product =>
            product.ten_danh_muc?.trim().toLowerCase() === category.trim().toLowerCase() &&
            product.ten_gioi_tinh === "1"
        );
          console.log("Sản phẩm sau khi lọc:", this.filteredProducts);

          if (this.filteredProducts.length === 0) {
            console.warn("Không tìm thấy sản phẩm nào khớp với danh mục và giới tính");
          }
        } else {
          console.error("Không có sản phẩm nào được tìm thấy");
          this.products = [];
        }
      },
      error => {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    );
}

  girlFashionItem(category: any){
    this.isMenProduct = false;
    this.isGirlProduct = false;
    this.productService.getProducts().subscribe(
      (response: any) => {
        if (response.status === "success") {
          const baseUrl = 'http://localhost:3000/api';
          this.products = response.data.map((product: any) => ({
            ...product,
            anh_san_pham: `${baseUrl}${product.anh_san_pham}`
          }));

          // In ra tất cả sản phẩm để kiểm tra
          console.log("Tất cả sản phẩm:", this.products);

          // Thử lọc dựa trên danh mục và giới tính
          this.filteredProducts = this.products.filter(product =>
            product.ten_danh_muc?.trim().toLowerCase() === category.trim().toLowerCase() &&
            product.ten_gioi_tinh === "2"
        );
          console.log("Sản phẩm sau khi lọc:", this.filteredProducts);

          if (this.filteredProducts.length === 0) {
            console.warn("Không tìm thấy sản phẩm nào khớp với danh mục và giới tính");
          }
        } else {
          console.error("Không có sản phẩm nào được tìm thấy");
          this.products = [];
        }
      },
      error => {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    );

  }

  showInfo() {
    this.isHovered = true
  }
  updateInfo(){

  }
  changePassword(){

  }

  orderHistory(){
  }

  showVoucher() {
    this.isVoucherModalVisible = true;

  }

  closeVoucherModal(){
    this.isVoucherModalVisible = false;
  }

  logout() {
    localStorage.removeItem('user');
    this.cartCount = 0;
    this.user = null;
  }

  openMessengerChat(): void {
    window.open('https://m.me/465523839984428', '_blank');
}
}
