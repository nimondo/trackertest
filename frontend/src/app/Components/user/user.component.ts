import { Component } from '@angular/core';

import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  //save userId in a varibale
  userId: string = '';
  userInfo: any = {};
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    this.userId = this.authService.getUserId() as string;
    this.refreshProfile();
  }

  //get User Info
  refreshProfile() {
    this.userInfo.userId = this.authService.getUserId();
    this.userInfo.email = this.authService.getUser();
    this.userInfo.role = this.authService.getRole();
  }
}
