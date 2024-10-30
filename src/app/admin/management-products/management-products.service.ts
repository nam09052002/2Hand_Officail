import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiProductResponse, Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost/api/management-products/'; // Đường dẫn API

  constructor(private http: HttpClient) {}

  // Lấy danh sách sản phẩm
  getProducts(): Observable<ApiProductResponse> {
    return this.http.get<ApiProductResponse>(`${this.apiUrl}get-products.php`);
  }

  // Thêm sản phẩm
  addProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}add-product.php`, formData);
  }

  // Cập nhật sản phẩm
  updateProduct(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}delete-product.php`, {
        body: { id_san_pham: productId } // Gửi ID sản phẩm trong body
    });
}

}
