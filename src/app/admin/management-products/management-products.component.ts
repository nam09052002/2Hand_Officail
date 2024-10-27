import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiProductResponse, Product } from '../../models/product.model';
import { ProductService } from './management-products.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AddProductsComponent } from './add-products/add-products.component';

@Component({
  selector: 'app-manage-products',
  templateUrl: './management-products.component.html',
  styleUrls: ['./management-products.component.css'],
  animations: [
    trigger('translateTab', [
      state('void', style({
        transform: 'translateY(-100%)'
      })),
      state('*', style({
        transform: 'translateY(0)'
      })),
      transition('void <=> *', [
        animate(300)
      ]),
    ]),
  ],
})
export class ManagementProductsComponent implements OnInit {
  products: Product[] = []; // Danh sách sản phẩm
  filteredProducts: Product[] = []; // Sản phẩm đã lọc theo tìm kiếm
  searchTerm: string = ''; // Từ khóa tìm kiếm

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchProducts(); // Lấy danh sách sản phẩm khi khởi tạo
  }

  // Trong component của bạn
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

  filterProducts() {
    this.filteredProducts = this.products.filter(product =>
      product?.ten_san_pham?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddProductDialog() {
    const dialogRef = this.dialog.open(AddProductsComponent, {
      width: '400px', // Độ rộng của dialog
      maxWidth: '90vw', // Đặt chiều rộng tối đa là 90% chiều rộng của viewport
      // Dữ liệu khác có thể cần truyền vào dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Xử lý kết quả trả về nếu cần
        this.fetchProducts(); // Tải lại danh sách sản phẩm
      }
    });
  }

  deleteProduct(productId: number) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(productId).subscribe(
        (response: any) => {
          // Kiểm tra xem response có message không
          if (response && response.message) {
            alert(response.message); // Thông báo khi xóa thành công
          } else {
            alert('Sản phẩm đã được xóa thành công!'); // Nếu không có message trả về
          }
          this.fetchProducts(); // Tải lại danh sách sản phẩm
        },
        error => {
          // Hiển thị thông báo lỗi chi tiết hơn
          console.error('Error occurred:', error);
          alert('Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại sau!');
        }
      );
    }
  }



  editProduct(product: Product) {
    // Thêm logic để sửa sản phẩm nếu cần
  }
}
