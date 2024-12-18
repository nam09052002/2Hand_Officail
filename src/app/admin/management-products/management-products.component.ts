import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiProductResponse, Product } from '../../models/product.model';
import { ProductService } from './management-products.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AddProductsComponent } from './add-products/add-products.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manage-products',
  templateUrl: './management-products.component.html',
  styleUrls: ['./management-products.component.css'],
  animations: [
    trigger('translateTab', [
      state('void', style({ transform: 'translateY(-100%)' })),
      state('*', style({ transform: 'translateY(0)' })),
      transition('void <=> *', [animate(300)]),
    ]),
  ],
})
export class ManagementProductsComponent implements OnInit {
  products: Product[] = []; // Danh sách sản phẩm
  filteredProducts: Product[] = []; // Sản phẩm đã lọc theo tìm kiếm
  searchTerm: string = ''; // Từ khóa tìm kiếm
  activeTab: string = 'products';
  isViewModalOpen: boolean = false; // Trạng thái modal xem sản phẩm
  selectedProduct: Product = {} as Product; // Sản phẩm được chọn để xem
  formattedPrice: string = ''; // Giá đã định dạng
  sortDirection: { [key: string]: 'asc' | 'desc' | null } = {};


  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchProducts(); // Lấy danh sách sản phẩm khi khởi tạo
  }

  fetchProducts() {
    this.productService.getProducts().subscribe(
      (response: any) => {
        if (response.status === "success") {
          const baseUrl = 'http://localhost:3000/api'; // Địa chỉ cơ sở
          this.products = response.data.map((product:any) => ({
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
      product?.ten_san_pham?.toLowerCase().includes(this.searchTerm.toLowerCase().trim()) ||
      product?.ten_danh_muc?.toLowerCase().includes(this.searchTerm.toLowerCase().trim()) ||
      product?.ten_nhan_hieu?.toLowerCase().includes(this.searchTerm.toLowerCase().trim()) ||
      product?.ten_nha_cung_cap?.toLowerCase().includes(this.searchTerm.toLowerCase().trim())
      // || product?.gia_ban?.toString().includes(this.searchTerm)
    );
  }

  openAddProductDialog() {
    const dialogRef = this.dialog.open(AddProductsComponent, {
      width: '400px', // Độ rộng của dialog
      maxWidth: '90vw', // Đặt chiều rộng tối đa là 90% chiều rộng của viewport
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
          console.error('Error occurred:', error);
          alert('Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại sau!');
        }
      );
    }
  }

  viewProduct(product: Product) {
    this.selectedProduct = { ...product };
    console.log("this.selectedProduct", this.selectedProduct)
    this.isViewModalOpen = true; // Mở modal
  }

  closeViewModal() {
    this.isViewModalOpen = false;
  }

  saveProduct() {
    const params = {
      id_san_pham: String(this.selectedProduct.id_san_pham),
      ten_san_pham: this.selectedProduct.ten_san_pham,
      mo_ta: this.selectedProduct.mo_ta,
      ten_nhan_hieu: this.selectedProduct.ten_nhan_hieu,
      ten_nha_cung_cap: this.selectedProduct.ten_nha_cung_cap,
      gia_nhap: String(this.selectedProduct.gia_nhap),
      gia_ban: String(this.selectedProduct.gia_ban),
      ton_kho: String(this.selectedProduct.ton_kho),
      // da_ban: String(this.selectedProduct.da_ban)

    }


    console.log('Sending update with params:', params);
    this.http.post('http://localhost:3000/api/management-products/update-product1', params)
    .subscribe(
      (response: any) => {
        if (response.status === 'success') {
          alert('Cập nhật thông tin thành công!');
          this.fetchProducts(); // Tải lại danh sách sản phẩm sau khi cập nhật
                this.closeViewModal(); // Đóng modal sau khi lưu
        } else {
          alert('Lỗi: ' + response.message);
        }
      },
      (error) => {
        alert('Có lỗi xảy ra khi cập nhật thông tin!');
        console.error(error);
      }
    );
  }
  sortTable(column: string, order: 'asc' | 'desc') {
    const sorted = [...this.filteredProducts].sort((a, b) => {
      let valA = (a as any)[column];
      let valB = (b as any)[column];


        if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (order === 'asc') {
            return valA > valB ? 1 : valA < valB ? -1 : 0;
        } else {
            return valA < valB ? 1 : valA > valB ? -1 : 0;
        }
    });

    this.filteredProducts = sorted;
}



}
