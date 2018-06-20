import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-article-remove-dialog',
  templateUrl: 'article-remove-dialog.component.html'
})

export class ArticleRemoveDialogComponent implements OnInit {
  constructor(
    private _dialogRef: MatDialogRef<ArticleRemoveDialogComponent>
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
