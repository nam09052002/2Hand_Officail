import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
 // Đảm bảo bạn đã tạo model cho sản phẩm

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost/api/products'; // Đường dẫn API

  constructor(private http: HttpClient) {}

  // Lấy danh sách sản phẩm
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Thêm sản phẩm
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // Cập nhật sản phẩm
  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product);
  }

  // Xóa sản phẩm
  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }
}
