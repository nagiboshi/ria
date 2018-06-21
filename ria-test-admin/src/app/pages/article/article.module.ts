import { ArticleListComponent } from './list/article-list.component';
import { SharedModule } from '../../shared/shared.module';
import { ArticleComponent } from './article.component';
import { NgModule } from '@angular/core';
import { ArticleRoutingModule } from './article-routing.module';
import { ArticleRemoveDialogComponent } from './list/article-remove-dialog/article-remove-dialog.component';
import { ArticleService } from '../../services/article.service';
import { ArticleEditDialogComponent } from './list/article-edit-dialog/article-edit-dialog.component';

const components = [
  ArticleComponent,
  ArticleListComponent,
  ArticleRemoveDialogComponent,
  ArticleEditDialogComponent
];

@NgModule({
  imports: [
    SharedModule,
    ArticleRoutingModule
  ],
  exports: [],
  providers: [ ArticleService ],
  entryComponents: [...components],
  declarations: [...components]
})
export class ArticleModule { }
