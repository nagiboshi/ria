import { AuthGuard } from './../../guards/auth-guard.service';
import { ArticleListComponent } from './list/article-list.component';
import { ArticleComponent } from './article.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
  path: 'article',
    component: ArticleComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: '/article/list', pathMatch: 'full' },
          { path: 'list', component: ArticleListComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: [],
  providers: [
    AuthGuard
  ],
})
export class ArticleRoutingModule { }
