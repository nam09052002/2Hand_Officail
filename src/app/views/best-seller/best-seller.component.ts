import { Component } from '@angular/core';
import { ApiProductResponse, Product } from '../../models/product.model';
import { ProductService } from '../../admin/management-products/management-products.service';

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrl: './best-seller.component.css'
})
export class BestSellerComponent {


  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts(); // Gọi hàm để lấy sản phẩm khi component khởi tạo
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

  addToCart(product: Product) {
    console.log('Thêm vào giỏ hàng:', product);
    // Thêm logic để thêm sản phẩm vào giỏ hàng
  }
}
