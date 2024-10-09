import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../models/product.model';
import { ProductService } from './management-products.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: './management-products.component.html',
  styleUrls: ['./management-products.component.css']
})
export class ManagementProductsComponent implements OnInit {
  products: Product[] = []; // Danh sách sản phẩm
  filteredProducts: Product[] = []; // Sản phẩm đã lọc theo tìm kiếm
  searchTerm: string = ''; // Từ khóa tìm kiếm

  constructor(private productService: ProductService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchProducts(); // Lấy danh sách sản phẩm khi khởi tạo
  }

  fetchProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data; // Mặc định hiển thị tất cả sản phẩm
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product =>
      product.ten_san_pham.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddProductDialog() {
    // const dialogRef = this.dialog.open(AddProductComponent, {
    //   width: '400px', // Độ rộng của dialog
    //   maxWidth: '90vw', // Đặt chiều rộng tối đa là 90% chiều rộng của viewport
    //   // Dữ liệu khác có thể cần truyền vào dialog
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     // Xử lý kết quả trả về nếu cần
    //     this.fetchProducts(); // Tải lại danh sách sản phẩm
    //   }
    // });
  }

  deleteProduct(productId: number) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(productId).subscribe(() => {
        this.fetchProducts(); // Tải lại danh sách sản phẩm
      });
    }
  }

  editProduct(product: Product) {
    // Thêm logic để sửa sản phẩm nếu cần
  }
}
