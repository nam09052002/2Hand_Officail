import { Component } from '@angular/core';

export interface Category {
  id: number;
  name: string;
}


@Component({
  selector: 'app-product-classification',
  templateUrl: './product-classification.component.html',
  styleUrl: './product-classification.component.css'
})
export class ProductClassificationComponent {

  searchTerm: string = '';
  newCategoryName: string = '';
  newCategoryType: string = 'nam'; // Mặc định là 'nam'
  filteredCategories: any[] = []; // Danh sách danh mục đã lọc
  allCategories: any[] = []; // Danh sách tất cả danh mục
  isAddCategoryModalOpen: boolean = false;

  ngOnInit() {
    // Lấy danh sách danh mục từ server khi component được khởi tạo
    this.fetchCategories();
  }

  fetchCategories() {
    // Giả sử bạn gọi API để lấy danh mục
    // Thay thế bằng mã gọi API thực tế
    this.allCategories = [
      { id: 1, name: 'Áo Nam', type: 'nam' },
      { id: 2, name: 'Giày Nữ', type: 'nu' },
      { id: 3, name: 'Quần Jean Nam', type: 'nam' },
      { id: 4, name: 'Đầm Nữ', type: 'nu' },
    ];

    this.filteredCategories = [...this.allCategories];
  }

  openAddCategoryModal() {
    this.isAddCategoryModalOpen = true;
  }

  closeAddCategoryModal() {
    this.isAddCategoryModalOpen = false;
    this.resetNewCategoryForm();
  }

  addCategory() {
    const newCategory = {
      id: this.allCategories.length + 1, // Tạo ID tự động
      name: this.newCategoryName,
      type: this.newCategoryType // Thêm loại phân loại
    };

    // Gọi API để thêm danh mục mới vào cơ sở dữ liệu
    // Thay thế bằng mã gọi API thực tế
    this.allCategories.push(newCategory);
    this.filteredCategories.push(newCategory);
    this.closeAddCategoryModal();
  }

  editCategory(category: any) {
    // Logic để sửa danh mục
    // Thực hiện các bước để sửa thông tin danh mục
  }

  deleteCategory(categoryId: number) {
    // Logic xóa danh mục
    this.allCategories = this.allCategories.filter(category => category.id !== categoryId);
    this.filteredCategories = this.filteredCategories.filter(category => category.id !== categoryId);
  }

  onSearchChange() {
    this.filteredCategories = this.allCategories.filter(category =>
      category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  resetNewCategoryForm() {
    this.newCategoryName = '';
    this.newCategoryType = 'nam'; // Đặt lại phân loại về mặc định
  }
}
