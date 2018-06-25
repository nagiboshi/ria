import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, ViewChild, Inject, ElementRef, OnInit } from '@angular/core';
import {IArticleModel} from '../../../../models/article.model';
import {ArticleService} from '../../../../services/article.service';
import { IRiskGroup } from '../../../../models/riskgroup.model';
import { RiskGroupService } from '../../../../services/riskGroup.service';
import { NgxWigToolbarService } from 'ngx-wig';

@Component({
  selector: 'app-article-dialog',
  templateUrl: 'article-dialog.component.html',
  styleUrls: ['article-dialog.component.css']
})

export class ArticleDialogComponent implements OnInit {
  @ViewChild('imageUploader') imageUploader: ElementRef;
  public errorMessage: string;
  public riskGroups: IRiskGroup[];
  article: IArticleModel;
  isNew: boolean;

  constructor(
    private _dialog: MatDialogRef<ArticleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _articleService: ArticleService,
    private ngxWigToolbarService: NgxWigToolbarService,
    private _riskGroupService: RiskGroupService
  ) {}

  selectedArticlesFunc(o1, o2) {
   if ( !o1 ) {
     return false;
   }
   if ( !o2 ) {
     return false;
   }
   return o1 === o2._id;
  }

  onImageUpload(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (ev: any) => {
        this.article.image = ev.target.result;
      };

    reader.readAsDataURL(e.target.files[0]);
    }
  }

  deleteImg() {
    this.article.image = null;
    this.imageUploader.nativeElement.value = '';
  }

  ngOnInit() { 
    this._riskGroupService.getAll().then((allRiskGroups: IRiskGroup[]) => { 
      this.riskGroups = allRiskGroups;
    });
    this.article = this.data.article;
    this.isNew = this.data.isNew;
    this.ngxWigToolbarService.addStandardButton('wow', 'wow', '', '');
    // this.ngxWigToolbarService.setButtons(['wow']);
  }

  onNoClick(): void {
    this._dialog.close();
  }

  close() {
    this._dialog.close();
  }

  add() {
    this._dialog.close();
    this._articleService
      .addArticle(this.article)
      .catch(this._errorHandler.bind(this));
  }

  _errorHandler(error) {
    switch (error.code) {
      case 6002:
        this.errorMessage = 'Статья с таким названием уже существует';
        break;
      default: return console.error(error);
    }

    return setTimeout(() => this.errorMessage = '', 5000);
  }

}
