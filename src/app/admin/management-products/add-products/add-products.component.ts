import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../management-products.service';
import { log } from 'node:console';

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
  danhMucSanPham: any[] = []; // Mảng chứa loại sản phẩm
  nhanHieuList: any[] = []; // Mảng chứa nhãn hiệu
  nhaCungCapList: any[] = []; // Mảng chứa nhà cung cấp
  filteredCategories: string[] = [];
  isModalOpen = false;

  constructor(private fb: FormBuilder, private productService: ProductService, private http: HttpClient,) {
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
      ton_kho: ['',[Validators.required, Validators.min(0)]],
      mau_sac: ['', Validators.required],
      kich_thuoc: ['', Validators.required]

    });
  }

  ngOnInit(): void {
    this.loadProductCategories();
    this.loadBrands();
    this.loadSuppliers();
    this.isModalOpen = true;
  }

  loadProductCategories() {

    this.http.get('http://localhost/api/product-catalog/get-catalog.php').subscribe(
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

  onGenderChange(){
    const valueGioiTinh = this.productForm.get('ten_gioi_tinh')?.value
    // console.log("CHECK DATAT", valueGioiTinh)

    if (valueGioiTinh == 1) {
      this.filteredCategories = [];
      this.danhMucSanPham.forEach((item:any) => {
        if(item.phan_loai === "nam") {
          this.filteredCategories.push(item.ten_danh_muc)
          console.log("this.filteredCategories", this.filteredCategories)

        }
      })
    }

     else {
      this.filteredCategories = [];
      this.danhMucSanPham.forEach((item:any) => {
        if(item.phan_loai === "nu") {
          this.filteredCategories.push(item.ten_danh_muc)
          console.log("this.filteredCategories", this.filteredCategories)

        }
      })
    }
  }

  loadBrands() {
    // this.productService.getBrands().subscribe(data => {
    //   this.nhanHieuList = data;
    // });
  }

  loadSuppliers() {
    // this.productService.getSuppliers().subscribe(data => {
    //   this.nhaCungCapList = data;
    // });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.productForm.patchValue({
          anh_san_pham: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    // if (this.productForm.valid) {
      const formValue = { ...this.productForm.value };

      if (formValue.ten_gioi_tinh === '1') {
        formValue.ten_gioi_tinh = "Nam";
      } else if (formValue.ten_gioi_tinh === '2') {
        formValue.ten_gioi_tinh = "Nữ";
      }


      this.productService.addProduct(formValue).subscribe(response => {
        alert(response.message);
      });
    // }

  }

  closeModal() {
    this.isModalOpen = false;
  }
}
