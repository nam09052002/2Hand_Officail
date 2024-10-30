import { Component, OnInit } from '@angular/core';
import { ApiProductResponse, Product } from '../models/product.model';
import { ProductService } from '../admin/management-products/management-products.service';
import { Router } from '@angular/router';
import { CartItem } from '../models/cart-item.model';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart-modal/cart.service';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.css'] // Sửa từ 'styleUrl' thành 'styleUrls'
})
export class ViewsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProductsCount = 18;
  showAllProducts = false;
  selectedProduct: any; // Hoặc kiểu dữ liệu cụ thể của sản phẩm
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

  constructor(
    private productService: ProductService,
    private router: Router,
    private http: HttpClient,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.isSelectedProduct = false; // Gọi hàm để lấy sản phẩm khi component khởi tạo
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    // this.cartCount = parseInt(localStorage.getItem('cartCount') || '0', 10);
    // this.cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]') || []; // Khôi phục giỏ hàng từ localStorage
    if (this.user?.id_nguoi_dung) {
      this.loadCart(this.user.id_nguoi_dung);
    }
    // this.loadCart(this.user.id_nguoi_dung);
    this.getCatalog();
    this.menFashion();
    this.girlFashion();
  }
  getCatalog(){
    this.http.get('http://localhost/api/product-catalog/get-catalog.php').subscribe(
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
      (data: ApiProductResponse) => {
        console.log("CHECK DATA", data);

        if (data && data.products) {
          const baseUrl = 'http://localhost/api/'; // Địa chỉ cơ sở
          this.products = data.products.map(product => ({
            ...product,
            anh_san_pham: `${baseUrl}${product.anh_san_pham}` // Thêm đường dẫn cơ sở
          }));
          this.filteredProducts = [...this.products]; // Mặc định hiển thị tất cả sản phẩm
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
  loadCart(id_nguoi_dung: number): void {
    this.cartService.getCart(id_nguoi_dung).subscribe(
      (response) => {
        if (response.success === true) {
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
    const apiUrl = 'http://localhost/api/carts/add-cart.php';
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
    const apiUrl = 'http://localhost/api/orders/add-order.php';
    this.http.post(apiUrl, oderItem).subscribe(
      (response: any) => {
        // Kiểm tra mã trạng thái phản hồi
        if (response.status === 200 || response.status === 201) {

          alert(response.message);
          this.onCloseModal(); // Đóng modal sau khi thêm sản phẩm
          window.location.reload();
        } else {
          // this.cartCount++
          // this.loadCart(this.user.id_nguoi_dung);
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
  menFashion(){
    this.productService.getProducts().subscribe(
      (data: ApiProductResponse) => {
        if (data && data.products) {
          const baseUrl = 'http://localhost/api/';
          this.products = data.products.map(product => ({
            ...product,
            anh_san_pham: `${baseUrl}${product.anh_san_pham}`
          }));
          // Lọc sản phẩm có giới tính 'Nam' sau khi đã lấy dữ liệu thành công
          this.menProducts = this.products.filter(product => product.ten_gioi_tinh === 'Nam');
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
      (data: ApiProductResponse) => {
        if (data && data.products) {
          const baseUrl = 'http://localhost/api/';
          this.products = data.products.map(product => ({
            ...product,
            anh_san_pham: `${baseUrl}${product.anh_san_pham}`
          }));
          // Lọc sản phẩm có giới tính 'Nam' sau khi đã lấy dữ liệu thành công
          this.girlProducts = this.products.filter(product => product.ten_gioi_tinh === 'Nữ');
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
      (data: ApiProductResponse) => {
        if (data && data.products) {
          const baseUrl = 'http://localhost/api/';
          this.products = data.products.map(product => ({
            ...product,
            anh_san_pham: `${baseUrl}${product.anh_san_pham}`
          }));

          // In ra tất cả sản phẩm để kiểm tra
          console.log("Tất cả sản phẩm:", this.products);

          // Thử lọc dựa trên danh mục và giới tính
          this.filteredProducts = this.products.filter(product =>
            product.ten_danh_muc?.trim().toLowerCase() === category.trim().toLowerCase() &&
            product.ten_gioi_tinh === 'Nam'
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
      (data: ApiProductResponse) => {
        if (data && data.products) {
          const baseUrl = 'http://localhost/api/';
          this.products = data.products.map(product => ({
            ...product,
            anh_san_pham: `${baseUrl}${product.anh_san_pham}`
          }));

          // In ra tất cả sản phẩm để kiểm tra
          console.log("Tất cả sản phẩm:", this.products);

          // Thử lọc dựa trên danh mục và giới tính
          this.filteredProducts = this.products.filter(product =>
            product.ten_danh_muc?.trim().toLowerCase() === category.trim().toLowerCase() &&
            product.ten_gioi_tinh === 'Nữ'
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

  orderHistory(){}

  logout() {
    localStorage.removeItem('user');
    this.cartCount = 0;
    this.user = null; // Cập nhật trạng thái
  }
}
