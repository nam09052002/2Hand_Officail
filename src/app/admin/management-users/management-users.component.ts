import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from './edit-user/edit-user.component';
import { HttpClient } from '@angular/common/http'; // Import HttpClient

@Component({
  selector: 'app-management-users',
  templateUrl: './management-users.component.html',
  styleUrls: ['./management-users.component.css']
})
export class ManagementUsersComponent implements OnInit {
  users: User[] = [];
  searchTerm: string = '';

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get<User[]>('http://localhost/api/routes/userRoutes.php') // Gọi API để lấy người dùng
      .subscribe(users => {
        this.users = users;
      }, error => {
        console.error('Error fetching users:', error);
      });
  }

  deleteUser(id_nguoi_dung: number) {
    this.http.delete('http://localhost/api/routes/userRoutes.php', { body: { id_nguoi_dung } }) // Gọi API để xóa người dùng
      .subscribe(response => {
        console.log(response);
        this.users = this.users.filter(user => user.id_nguoi_dung !== id_nguoi_dung);
      }, error => {
        console.error('Error deleting user:', error);
      });
  }


  editUser(user: User) {
    const dialogRef = this.dialog.open(EditUserComponent, {
        width: '400px', // Độ rộng của dialog
        maxWidth: '90vw', // Đặt chiều rộng tối đa là 90% chiều rộng của viewport
        data: user, // Truyền dữ liệu người dùng vào modal
        panelClass: 'custom-modal',
        hasBackdrop: true, // Đảm bảo có nền mờ phía sau
        disableClose: true, // Ngăn không cho đóng modal bằng cách nhấn bên ngoài
        // position: { top: '50%', left: '50%' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Gọi API để cập nhật người dùng
        this.http.put('http://localhost/api/routes/userRoutes.php', result)
          .subscribe(response => {
            console.log(response);
            const index = this.users.findIndex(u => u.id_nguoi_dung === result.id_nguoi_dung);
            if (index > -1) {
              this.users[index] = result;
            }
          }, error => {
            console.error('Error updating user:', error);
          });
      }
    });
  }

  get filteredUsers() {
    return this.users.filter(user =>
      user.ten_dang_nhap.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
