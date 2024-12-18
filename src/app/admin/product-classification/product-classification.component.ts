import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

export interface Category {
  id: number;
  ten_danh_muc: string;
  phan_loai: string;
}

@Component({
  selector: 'app-product-classification',
  templateUrl: './product-classification.component.html',
  styleUrls: ['./product-classification.component.css'] // Fixed the property name here
})
export class ProductClassificationComponent implements OnInit {
  categories: Category[] = []; // Type the array correctly
  searchTerm: string = '';
  isAddCategoryModalOpen: boolean = false;
  newCategoryName: string = '';
  newCategoryType: string = 'nam'; // Default value
  filteredCategories: Category[] = [];
  isEditCategoryModalOpen: boolean = false;
  categoryToEdit: Category | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getCategories();
  }

  // Fetch product categories
  getCategories() {
    this.http.get('http://localhost:3000/api/product-catalog/get-catalog').subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.categories = response.data;
          this.filteredCategories = this.categories;
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  // Open the add category modal
  openAddCategoryModal() {
    this.isAddCategoryModalOpen = true;
    this.newCategoryName = '';
    this.newCategoryType = 'nam'; // Reset to default value
  }

  // Close the add category modal
  closeAddCategoryModal() {
    this.isAddCategoryModalOpen = false;
  }

  // Add a new category
  addCategory() {
    const newCategory: Category = {
      id: this.categories.length + 1, // Assign a temporary ID
      ten_danh_muc: this.newCategoryName,
      phan_loai: this.newCategoryType
    };

    this.http.post('http://localhost:3000/api/product-catalog/add-catalog', newCategory).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.categories.push(newCategory); // Update the list
          alert(response.message);
          this.closeAddCategoryModal(); // Close modal
          this.getCategories(); // Refresh categories
        }
      },
      (error) => {
        alert('Error adding category!');
      }
    );
  }


  // Delete a category
  deleteCategory(id: number) {
    if (confirm('Bạn chắc chắn sẽ xóa danh mục sản phẩm này chứ?')) {
      this.http.delete('http://localhost:3000/api/product-catalog/delete-catalog', {
        body: { id: id }
      }).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.categories = this.categories.filter(category => category.id !== id); // Update the list
            alert(response.message);
            this.getCategories(); // Refresh categories
          }
        },
        (error) => {
          console.error('Error deleting category:', error);
        }
      );
    }
  }

  editCategory(category: Category) {
    this.isEditCategoryModalOpen = true;
    // Ensure categoryToEdit is fully populated
    this.categoryToEdit = {
        id: category.id,
        ten_danh_muc: category.ten_danh_muc,
        phan_loai: category.phan_loai
    };
}

updateCategory() {
  if (this.categoryToEdit) {
      const { id, ten_danh_muc, phan_loai } = this.categoryToEdit;

      // Ensure that 'id' is defined before updating the category
      if (id !== undefined && ten_danh_muc !== undefined && phan_loai !== undefined) {
          this.http.put('http://localhost:3000/api/product-catalog/update-catalog', this.categoryToEdit).subscribe(
              (response: any) => {
                  if (response.status === 'success') {
                      const index = this.categories.findIndex(cat => cat.id === id);
                      if (index !== -1) {
                          // Only assign if all properties are available
                          this.categories[index] = {
                              id: id, // Ensure id is of type number
                              ten_danh_muc: ten_danh_muc, // Ensure ten_danh_muc is of type string
                              phan_loai: phan_loai // Ensure phan_loai is of type string
                          }; // Update the local list
                      }
                      alert(response.message);
                      this.closeEditCategoryModal(); // Close modal
                      this.getCategories(); // Refresh categories
                  } else {
                      alert(`Error: ${response.message}`);
                  }
              },
              (error) => {
                  console.error('Error updating category:', error);
                  alert('Error updating category! Please try again later.');
              }
          );
      } else {
          alert('All fields are required to update the category.'); // Handle case where properties are undefined
      }
  } else {
      alert('No category selected for editing.'); // Handle case where no category is selected
  }
}




  // Close the edit category modal
  closeEditCategoryModal() {
    this.isEditCategoryModalOpen = false;
    this.categoryToEdit = null; // Reset to null
  }

  // Search categories
  onSearchChange() {
    this.filteredCategories = this.categories.filter(category =>
      category.ten_danh_muc.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
