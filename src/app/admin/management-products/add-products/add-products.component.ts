import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../management-products.service';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css'] // Sửa lỗi chính tả ở đây
})
export class AddProductsComponent {

//   productForm: FormGroup;
//   selectedFile: File | null = null; // Biến để lưu trữ tệp đã chọn

//   constructor(private fb: FormBuilder, private productService: ProductService) {
//     this.productForm = this.fb.group({
//       ten_san_pham: ['', Validators.required],
//       mo_ta: ['', Validators.required],
//       gioi_tinh_id: ['', Validators.required],
//       id_loai_san_pham: ['', Validators.required],
//       id_nhan_hieu: ['', Validators.required],
//       id_nha_cung_cap: ['', Validators.required],
//       gia_nhap: ['', [Validators.required, Validators.min(0)]],
//       gia_ban: ['', [Validators.required, Validators.min(0)]],
//     });
//   }

//   onFileSelected(event: any) {
//     this.selectedFile = event.target.files[0]; // Lưu trữ tệp đã chọn
//   }

//   onSubmit() {
//     if (this.productForm.valid) {
//       const formData = new FormData();
//       formData.append('ten_san_pham', this.productForm.value.ten_san_pham);
//       formData.append('mo_ta', this.productForm.value.mo_ta);
//       formData.append('gioi_tinh_id', this.productForm.value.gioi_tinh_id);
//       formData.append('id_loai_san_pham', this.productForm.value.id_loai_san_pham);
//       formData.append('id_nhan_hieu', this.productForm.value.id_nhan_hieu);
//       formData.append('id_nha_cung_cap', this.productForm.value.id_nha_cung_cap);
//       formData.append('gia_nhap', this.productForm.value.gia_nhap);
//       formData.append('gia_ban', this.productForm.value.gia_ban);

//       if (this.selectedFile) {
//         formData.append('anh_san_pham', this.selectedFile, this.selectedFile.name); // Thêm tệp ảnh vào FormData
//       }

//       // Gọi đến ProductService để thêm sản phẩm
//       this.productService.addProduct(formData).subscribe(response => {
//         console.log('Product added:', response);
//         alert('Sản phẩm đã được thêm thành công!'); // Thông báo thành công
//         this.productForm.reset(); // Reset form sau khi gửi thành công
//         this.selectedFile = null; // Reset tệp đã chọn
//       }, error => {
//         console.error('Error adding product:', error);
//         if (error.error && error.error.message) {
//           alert(error.error.message); // Hiển thị thông báo lỗi từ API
//         } else {
//           alert('Đã xảy ra lỗi không mong muốn.');
//         }
//       });
//     } else {
//       alert('Vui lòng điền đầy đủ thông tin sản phẩm.'); // Thông báo nếu form không hợp lệ
//     }
//   }
// }

productForm: FormGroup;
  loaiSanPham: any[] = []; // Mảng chứa loại sản phẩm
  nhanHieuList: any[] = []; // Mảng chứa nhãn hiệu
  nhaCungCapList: any[] = []; // Mảng chứa nhà cung cấp

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      ten_san_pham: ['', Validators.required],
      mo_ta: ['', Validators.required],
      gioi_tinh_id: ['', Validators.required],
      id_loai_san_pham: ['', Validators.required],
      id_nhan_hieu: ['', Validators.required],
      id_nha_cung_cap: ['', Validators.required],
      gia_nhap: ['', [Validators.required, Validators.min(0)]],
      gia_ban: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadProductCategories();
    this.loadBrands();
    this.loadSuppliers();
  }

  loadProductCategories() {
    // Gọi API để lấy danh sách loại sản phẩm
    // this.productService.getProductCategories().subscribe(data => {
    //   this.loaiSanPham = data;
    // });
  }

  loadBrands() {
    // Gọi API để lấy danh sách nhãn hiệu
    // this.productService.getBrands().subscribe(data => {
    //   this.nhanHieuList = data;
    // });
  }

  loadSuppliers() {
    // Gọi API để lấy danh sách nhà cung cấp
    // this.productService.getSuppliers().subscribe(data => {
    //   this.nhaCungCapList = data;
    // });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    // Xử lý file ảnh tại đây
  }

  onSubmit() {
    if (this.productForm.valid) {
      // Gọi API để thêm sản phẩm
      this.productService.addProduct(this.productForm.value).subscribe(response => {
        alert(response.message); // Hiển thị thông báo khi thêm sản phẩm thành công
      });
    }
  }
}
