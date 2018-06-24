import { ArticleListComponent } from './list/article-list.component';
import { SharedModule } from '../../shared/shared.module';
import { ArticleComponent } from './article.component';
import { NgModule } from '@angular/core';
import { ArticleRoutingModule } from './article-routing.module';
import { ArticleRemoveDialogComponent } from './list/article-remove-dialog/article-remove-dialog.component';
import { ArticleService } from '../../services/article.service';
import { NgxWigModule } from 'ngx-wig';
import { ArticleDialogComponent } from './list/article-dialog/article-dialog.component';

const components = [
  ArticleComponent,
  ArticleListComponent,
  ArticleRemoveDialogComponent,
  ArticleDialogComponent
];

@NgModule({
  imports: [
    SharedModule,
    ArticleRoutingModule, 
    NgxWigModule
  ],
  exports: [],
  providers: [ ArticleService ],
  entryComponents: [...components],
  declarations: [...components]
})
export class ArticleModule { }
