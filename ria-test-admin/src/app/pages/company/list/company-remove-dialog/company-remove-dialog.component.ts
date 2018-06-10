import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-company-remove-dialog',
  templateUrl: 'company-remove-dialog.component.html'
})

export class CompanyRemoveDialogComponent implements OnInit {
  constructor(
    private _dialogRef: MatDialogRef<CompanyRemoveDialogComponent>
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
