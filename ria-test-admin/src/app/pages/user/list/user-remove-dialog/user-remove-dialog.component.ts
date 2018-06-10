import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-user-remove-dialog',
  templateUrl: 'user-remove-dialog.component.html'
})

export class UserRemoveDialogComponent implements OnInit {
  constructor(
    private _dialogRef: MatDialogRef<UserRemoveDialogComponent>
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this._dialogRef.close();
  }

  close(): void {
    this._dialogRef.close();
  }

  submit(): void {
    this._dialogRef.close(true);
  }

}
