import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/carts/get-cart'; // Thay đổi URL nếu cần

  constructor(private http: HttpClient) { }

  getCart(id_nguoi_dung: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?id_nguoi_dung=${id_nguoi_dung}`);
  }

  deleteCartItem(id_gio_hang: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/carts/delete-cart`, {
      body: { id_gio_hang: id_gio_hang }
    });
  }

}
