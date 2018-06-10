import { NgModule } from '@angular/core';
import { IonicModule, NavController } from "ionic-angular";

import { MainPage } from './main';
import { TestsPage } from "./pages/tests/tests";
import { CurrentTestPage } from "./pages/tests/current-test/current-test";
import { AccountPage } from "./pages/account/account";
import { ArticlesPage } from "./pages/articles/articles";
import { ConsultationPage } from "./pages/consultation/consultation";
import { SignInPage } from "./pages/sign-in/sign-in";
import { SplashPage } from "./pages/splash/splash";
import { SignUpPage } from "./pages/sign-up/sign-up";
import { PasswordRecoveryPage } from "./pages/password-recovery/password-recovery";
import {PageTest} from '../common/components/page-test/page-test';
import {ListRadiogroupQuestion} from '../common/components/list-radiogroup-question/list-radiogroup-question';
import {CheckboxgroupQuestion} from '../common/components/checkboxgroup-question/checkboxgroup-question';
import {InputQuestion} from '../common/components/input-question/input-question';
import { ArticlePage } from "./pages/article/article";
import {ModalChangeFields} from "../common/components/modal-change-fields/modal-change-fields";

const components = [
  SplashPage,
  SignInPage,
  SignUpPage,
  MainPage,
  TestsPage,
  CurrentTestPage,
  AccountPage,
  ArticlesPage,
  ArticlePage,
  ConsultationPage,
  PasswordRecoveryPage,
  PageTest,
  ListRadiogroupQuestion,
  CheckboxgroupQuestion,
  InputQuestion,
  ModalChangeFields
];

@NgModule({
  imports: [
    IonicModule.forRoot(MainPage),
  ],
  exports: [],
  declarations: [ ...components ],
  entryComponents: [ ...components ],
  providers: [],
})
export class MainModule { }
