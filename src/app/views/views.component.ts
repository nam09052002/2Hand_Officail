import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiProductResponse, Product } from '../models/product.model';
import { ProductService } from '../admin/management-products/management-products.service';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrl: './views.component.css'
})
export class ViewsComponent{
  products: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProductsCount = 18;
  showAllProducts = false;
  selectedProduct: any; // Hoặc kiểu dữ liệu cụ thể của sản phẩm
  isSelectedProduct?: boolean;
  searchTerm: string = '';
  cartCount = 0;


  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.isSelectedProduct = false; // Gọi hàm để lấy sản phẩm khi component khởi tạo
  }

  fetchProducts() {
    this.productService.getProducts().subscribe(
      (data: ApiProductResponse) => {
        console.log("CHECK DATA", data);

        // Kiểm tra xem data.products có tồn tại và là một mảng
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

  // Hàm để tăng số lượng sản phẩm hiển thị
  loadMoreProducts() {
    this.displayedProductsCount += 6; // Tăng số lượng sản phẩm hiển thị lên 18
  }

  hideProducts() {
    this.displayedProductsCount -= 6; // Đặt lại số lượng sản phẩm hiển thị về 18
    this.showAllProducts = false; // Đặt trạng thái xem tất cả sản phẩm về false
  }

  openProductDetail(product: any) {
    console.log("CLICK")
    this.selectedProduct = product; // Gán sản phẩm được chọn
    this.isSelectedProduct = true;
  }

  onCloseModal() {
    console.log("2")
    this.isSelectedProduct = false; // Đặt lại để ẩn modal
  }
  addToCart(){
    console.log("ADD CArt")
    this.cartCount++;
  }

  onSearch() {
  this.filteredProducts = this.products.filter(product =>
      product.ten_san_pham.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.gia_ban.toString().includes(this.searchTerm) // Tìm kiếm theo giá
  );
}

}
