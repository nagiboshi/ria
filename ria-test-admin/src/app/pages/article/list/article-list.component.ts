import { IArticleModel } from './../../../models/article.model';
import { ArticleDialogComponent } from './article-dialog/article-dialog.component';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ArticleService } from '../../../services/article.service';
import { ArticleRemoveDialogComponent } from './article-remove-dialog/article-remove-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { IRiskGroup } from '../../../models/riskgroup.model';
import { RiskGroupService } from '../../../services/riskGroup.service';
import { ApiService } from '../../../services/api.service';
@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  riskGroups: IRiskGroup[] = [];
  isBusy = false;
  @Input() articleName: string;

  articles: IArticleModel[] = [];
  columns: string[] = [ 'delete', 'editor', 'title', 'body', 'image', 'riskGroups' ];

  constructor(
    private _articleService: ArticleService,
    private _dialogCtrl: MatDialog,
    private _riskGroupService: RiskGroupService,
    private _sanitizer: DomSanitizer,
    private _apiService: ApiService
  ) {}

  ngOnInit() {

    this._articleService.isBusy.subscribe((busyResult) => { 
      this.isBusy = busyResult;
    });
    this._riskGroupService.getAll().then((risks) => { 
      this.riskGroups =  risks;
      this._articleService.getArticles().subscribe((articles: IArticleModel[]) => {
        articles.map((article) => { 
          if ( article.image && !article.image.startsWith(this._apiService._basePath)) { 
           article['image'] = this._apiService._basePath + article.image;
          }
        });

        this.articles =  articles;
      });
    });

    
  }

  private newArticle() {
    return { _id:  null,
      title: '',
      body: '',
      image: '',
      riskGroups: [] };
  }
  addArticle() {
    const article: IArticleModel = this.newArticle();
    this._dialogCtrl
      .open(ArticleDialogComponent, { width: '80%', data: {'article': article, 'isNew': true } });
  }

  editArticle(article: IArticleModel) {
    this._dialogCtrl
      .open(ArticleDialogComponent, { width: '80%', data: {'article': article, 'isNew': false } });
  }

  unblockURL(url) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
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
