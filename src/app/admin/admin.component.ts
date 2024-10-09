import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
      // Kiểm tra xem mã có đang chạy trên trình duyệt không
      if (isPlatformBrowser(this.platformId)) {
          // Chỉ gọi localStorage khi đang chạy trên trình duyệt
          const data = localStorage.getItem('your_key');
          console.log(data);
      }
  }
}
