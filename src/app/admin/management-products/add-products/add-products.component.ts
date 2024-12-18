import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../management-products.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductsComponent implements OnInit {

  productForm: FormGroup;
  danhMucSanPham: any[] = [];  // List of product categories
  filteredCategories: string[] = [];  // List of filtered categories based on gender
  isModalOpen = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private http: HttpClient
  ) {
    this.productForm = this.fb.group({
      ten_san_pham: ['', Validators.required],
      mo_ta: ['', Validators.required],
      ten_gioi_tinh: ['', Validators.required],
      ten_danh_muc: ['', Validators.required],
      ten_nhan_hieu: ['', Validators.required],
      ten_nha_cung_cap: ['', Validators.required],
      gia_nhap: ['', [Validators.required, Validators.min(0)]],
      gia_ban: ['', [Validators.required, Validators.min(0)]],
      anh_san_pham: [null, Validators.required],
      da_ban: ['', [Validators.required, Validators.min(0)]],
      ton_kho: ['', [Validators.required, Validators.min(0)]],
      mau_sac: ['', Validators.required],
      kich_thuoc: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProductCategories();
    this.isModalOpen = true;
  }

  // Load product categories from the server
  loadProductCategories() {
    this.http.get('http://localhost:3000/api/product-catalog/get-catalog').subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.danhMucSanPham = response.data;
        }
      },
      (error) => {
        console.error('Lỗi khi lấy danh mục:', error);
      }
    );
  }

  // Filter product categories based on gender selection
  onGenderChange() {
    const valueGioiTinh = this.productForm.get('ten_gioi_tinh')?.value;
    this.filteredCategories = this.danhMucSanPham.filter((item: any) =>
      item.phan_loai === (valueGioiTinh === '1' ? 'nam' : 'nu')
    ).map((item: any) => item.ten_danh_muc);
  }

  // Handle file selection for image upload
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({
        anh_san_pham: file
      });
    }
  }

  // Submit the form and send data to the backend
  onSubmit() {
    // if (this.productForm.valid) {
      const formData = new FormData();

      // Append form fields to FormData, including the file
      Object.keys(this.productForm.value).forEach(key => {
        const value = this.productForm.value[key];
        if (key === 'anh_san_pham' && value) {
          formData.append(key, value, value.name);  // append file with name
        } else {
          formData.append(key, value);
        }
      });

      // Send form data to the server
      this.productService.addProduct(formData).subscribe(
        (response) => {
          alert(response.message);
          this.productForm.reset();  // Reset form after successful submission
          this.closeModal();
        },
        (error) => {
          this.closeModal();
          console.error('Error adding product:', error);
          alert('Có lỗi xảy ra trong quá trình thêm sản phẩm.');
        }
      );
    // } else {
    //   alert('Vui lòng điền đầy đủ thông tin sản phẩm.');
    // }
  }

  // Close modal if needed
  closeModal() {
    this.isModalOpen = false;
  }
}
