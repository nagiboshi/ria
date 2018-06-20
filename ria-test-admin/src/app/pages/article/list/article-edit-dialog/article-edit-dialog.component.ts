import {IArticleModel} from '../../../../models/article.model';
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ArticleService} from '../../../../services/article.service';

@Component({
  selector: 'app-article-edit-dialog',
  templateUrl: 'article-edit-dialog.component.html',
  styleUrls: ['article-edit-dialog.component.css']
})
export class ArticleEditDialogComponent {

  public updatedArticle: IArticleModel;
  public errorMessage: string;

  constructor(
    private _dialogRef: MatDialogRef<ArticleEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _article: IArticleModel,
    private _articleService: ArticleService
  ) {
    this.updatedArticle = Object.assign({}, this._article);
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

  close() {
    this._dialogRef.close();
  }

  save() {
    const isUpdated = Object
      .keys(this._article)
      .some(key => {
        return this._article[key] !== this.updatedArticle[key];
      });

    if (!isUpdated) {
      return this._errorHandler({code: 0});
    }

    this._articleService
      .updateArticle(this.updatedArticle)
      .then(() => this._dialogRef.close())
      .catch(this._errorHandler.bind(this));
  }

  _errorHandler(error) {
    switch (error.code) {
      case 0:
        this.errorMessage = 'Ни одно поле компании не изменилось';
        break;
      case 5001:
        this.errorMessage = 'Компании не сущестует';
        break;
      case 5003:
        this.errorMessage = 'Компания с таким именем уже существует';
        break;
      case 5004:
        this.errorMessage = 'Компания с таким кодом уже существует';
        break;
      default: return console.error(error);
    }

    return setTimeout(() => this.errorMessage = '', 5000);
  }

}
