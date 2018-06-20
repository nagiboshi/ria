import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';
import {IArticleModel} from '../../../../models/article.model';
import {ArticleService} from '../../../../services/article.service';

@Component({
  selector: 'app-article-add-dialog',
  templateUrl: 'article-add-dialog.component.html',
  styleUrls: ['article-add-dialog.component.css']
})

export class ArticleAddDialogComponent {

  public errorMessage: string;

  constructor(
    private _dialog: MatDialogRef<ArticleAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public articleName: string,
    private _articleService: ArticleService
  ) {}

  onNoClick(): void {
    this._dialog.close();
  }

  close() {
    this._dialog.close();
  }

  add() {
    this._articleService
      .addArticle(this.articleName)
      .then(() => this._dialog.close())
      .catch(this._errorHandler.bind(this));
  }

  _errorHandler(error) {
    switch (error.code) {
      case 5002:
        this.errorMessage = 'Компания с таким названием уже существует';
        break;
      default: return console.error(error);
    }

    return setTimeout(() => this.errorMessage = '', 5000);
  }

}
