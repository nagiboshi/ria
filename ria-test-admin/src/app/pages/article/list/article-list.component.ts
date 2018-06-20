import { IArticleModel } from './../../../models/article.model';
import { ArticleAddDialogComponent } from './article-add-dialog/article-add-dialog.component';
import { ArticleEditDialogComponent } from './article-edit-dialog/article-edit-dialog.component';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ArticleService } from '../../../services/article.service';
import {ArticleRemoveDialogComponent} from './article-remove-dialog/article-remove-dialog.component';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {

  @Input() articleName: string;

  companies: IArticleModel[] = [];
  columns: string[] = [ 'delete', 'editor', 'name', 'code' ];

  constructor(
    private _articleService: ArticleService,
    private _dialogCtrl: MatDialog
  ) {}

  ngOnInit() {
    this._articleService.getCompanies().subscribe((companies: IArticleModel[]) => {
      this.companies = companies;
    });
  }

  addArticle() {
    this._dialogCtrl
      .open(ArticleAddDialogComponent, { width: '250px' });
  }

  editArticle(article: IArticleModel) {
    this._dialogCtrl
      .open(ArticleEditDialogComponent, { width: '250px', data: { ...article } });
  }

  removeArticleById(article: IArticleModel) {
    this._dialogCtrl
      .open(ArticleRemoveDialogComponent, { width: '250px' })
      .afterClosed()
      .subscribe((answer: boolean) => {
        if (!answer) {
          return;
        }

        this._articleService.removeById(article._id);
      });
  }

}
