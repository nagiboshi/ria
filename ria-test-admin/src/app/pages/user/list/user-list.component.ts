import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUserModel } from '../../../models/user.model';
import {UserRemoveDialogComponent} from "./user-remove-dialog/user-remove-dialog.component";

@Component({
  selector: 'app-user-list',
  templateUrl: 'user-list.component.html',
  styleUrls: [ 'user-list.component.css' ]
})

export class UserListComponent implements OnInit {

  users: IUserModel[] = [];
  displayedColumns = ['delete', 'email', 'company', 'role', 'sex'];

  constructor(
    private _userService: UserService,
    private _auth: AuthService,
    private _router: Router,
    private _dialogCtrl: MatDialog
  ) {}

  ngOnInit() {
    this._userService
      .getUsers()
      .subscribe((users: IUserModel[]) => this.users = users);
  }

  removeUser(user: IUserModel): void {
    this._dialogCtrl
      .open(UserRemoveDialogComponent, { width: '250px' })
      .afterClosed()
      .subscribe((answer: boolean) => {
        if (!answer) {
          return;
        }
        this._userService.removeUserById(user.id);
      });
  }
}
