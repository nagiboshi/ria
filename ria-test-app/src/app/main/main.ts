import { Component } from '@angular/core';

import { ConsultationPage } from './pages/consultation/consultation';
import { AccountPage } from './pages/account/account';
import { ArticlesPage } from './pages/articles/articles';
import { TestsPage } from './pages/tests/tests';

@Component({
  template: `
    <ion-tabs>
      <ion-tab [root]="tab1Root" tabUrlPath="tests" tabTitle="Тесты" tabIcon="home"></ion-tab>
      <ion-tab [root]="tab2Root" tabUrlPath="recommendations" tabTitle="Рекомендации" tabIcon="list-box"></ion-tab>
      <ion-tab [root]="tab3Root" tabUrlPath="consultation" tabTitle="Консультация" tabIcon="chatbubbles"></ion-tab>
      <ion-tab [root]="tab4Root" tabUrlPath="account" tabTitle="Аккаунт" tabIcon="person"></ion-tab>
    </ion-tabs>
  `
})
export class MainPage {

  tab1Root = TestsPage;
  tab2Root = ArticlesPage;
  tab3Root = ConsultationPage;
  tab4Root = AccountPage;

  constructor() {
  }
}
