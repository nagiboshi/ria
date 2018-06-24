import { IArticleModel } from './../models/article.model';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ArticleService {
  isBusy: BehaviorSubject<boolean> = new BehaviorSubject(false);
  _articles: BehaviorSubject<IArticleModel[]> = new BehaviorSubject([]);
  _isLoaded = false;

  constructor(
    private _api: ApiService
  ) { }

  getArticles(): Observable<IArticleModel[]> {
    if (!this._isLoaded) {
      this.isBusy.next(true);
      this._api
        .get('articles')
        .then((articles: IArticleModel[]) => {
          this._isLoaded = true;
          this._articles.next(articles);
          this.isBusy.next(false);
        }).catch((e) => {
          this.isBusy.next(false);
        });
    }

    return this._articles.asObservable();
  }

  addArticle(article: IArticleModel): Promise<void> {
    this.isBusy.next(true);
    return this._api
      .post('article/add', { article })
      .then((savedArticle: IArticleModel) => {
        this.isBusy.next(false);
        this._articles.next([ ...this._articles.getValue(), savedArticle ]);
      });
  }

  updateArticle(article: IArticleModel): Promise<void> {
    return this._api
      .post('article/update', article)
      .then((updatedArticle: IArticleModel) => {
        const articles = [ ...this._articles.getValue() ];
        const index = articles.findIndex((item: IArticleModel) => {
          return item._id === article._id;
        });
        articles.splice(index, 1, updatedArticle);
        this._articles.next(articles);
      });
  }

  removeById(_id: string): Promise<void> {
    this.isBusy.next(true);
    return this._api
      .post('article/remove', { _id })
      .then(() => {
        const articles = this._articles.getValue().filter((article: IArticleModel) => {
          return article._id !== _id;
        });
        this.isBusy.next(false);
        this._articles.next(articles);
      })
      .catch((e) => {
        this.isBusy.next(false);
      });
  }

}
