import { User } from '../../../models/user.model';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {



user: User;
vai_tro: string = 'user';

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.user = { ...data }; // Sao chép dữ liệu người dùng
  }

  save() {
    this.dialogRef.close(this.user); // Đóng modal và trả về thông tin người dùng
  }

  cancel(): void {
    this.dialogRef.close(); // Đóng modal mà không trả về dữ liệu
  }
}
