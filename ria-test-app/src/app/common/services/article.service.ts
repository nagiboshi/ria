import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {Observable} from "rxjs/Observable";
import { IArticle } from '../models/article';

@Injectable()
export class ArticleService {
  private articles =  [];
  constructor(
    private _api: ApiService
  ) {}

  getArticles(riskGroups): Observable<IArticle[]> {
    return this._api
      .get('articles/get', { riskGroups });
  }

}
