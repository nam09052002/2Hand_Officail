import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { error } from 'console';
import { response } from 'express';
import { Vouchers } from '../../models/vouchers.model';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrl: './voucher.component.css'
})
export class VoucherComponent implements OnInit{


  @Output() closeModalEvent = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  vouchers: Vouchers[] = []

  ngOnInit(): void {

    this.loadVoucher();
  }

  loadVoucher(){
    this.http.get('http://localhost:3000/api/vouchers/get-voucher').subscribe(
      (response: any) => {
        if (response.status === "success") {

          // const ngayHomNay = new Date()
          // console.log("NAGYT", ngayHomNay)
          // this.vouchers = response.data.filter(
          //   (voucher:any) => voucher.trang_thai = true && new Date(voucher.ngay_het_han) >= ngayHomNay
          // )
          this.vouchers = response.data
        }
      },
      (error) => {
        console.log("Lỗi get vouchers")

      }
    )
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      alert('Đã sao chép mã: ' + code);
    }).catch(err => {
      console.error('Không thể sao chép mã: ', err);
    });
  }

  closeModal(): void {
    this.closeModalEvent.emit();
  }
}
