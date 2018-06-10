import { Component, OnInit } from '@angular/core';
import {TestService} from '../../../../common/services/test.service';
import {Test} from '../../../../common/models/test';
import {NavController, NavParams} from 'ionic-angular';
import {PreparePageTest} from '../../../../common/models/prepare-page-test';
import {QuestionPageTest} from '../../../../common/models/question-page-test';

@Component({
  selector: 'current-test-page',
  templateUrl: 'current-test.html'
})

export class CurrentTestPage implements OnInit {

  idTest: number;
  test: Test;
  preparePages: PreparePageTest[];
  questionPages: QuestionPageTest[];
  currentPage: object;
  listResult: string[] = [];

  constructor(
    private _navCtrl: NavController,
    private testService: TestService,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.idTest = this.navParams.get('id');
    this.test = this.testService.getTestWithCurrentId(this.idTest);
    this.prepareTest();
  }

  prepareTest() {
    this.preparePages = this.test.preparePages.map(page => {
       page.done = false;
       return page;
    });
    this.questionPages = this.test.listQuestions.map(page => {
      page.done = false;
      return page;
    });
    this.selectCurrentPage();
  }

  selectCurrentPage() {
    this.currentPage = null;
    for(let index = 0; index < this.preparePages.length; index ++) {
      if(this.preparePages[index].done === false) {
        this.currentPage = this.preparePages[index];
        return this.currentPage;
      }
    }
    for(let index = 0; index < this.questionPages.length; index ++) {
      if(this.questionPages[index].done === false) {
        this.currentPage = this.questionPages[index];
        return this.currentPage;
      }
    }
    if(!this.currentPage) {
      this.endTest();
    }
  }

  nextPageTest(event) {
    if(Array.isArray(event) && event.length > 0) {
      this.listResult = this.listResult.concat(event);
    }
    if(this.currentPage) {
      this.currentPage['done'] = true;
    }
    let resultPage = this.selectCurrentPage();
  }

  endTest() {
    this.testService.newResultTest(this.idTest, this.listResult)
      .subscribe(result => {
        this._navCtrl.pop();
      })
  }

}
