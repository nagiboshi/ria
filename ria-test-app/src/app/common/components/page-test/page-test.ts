import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {PreparePageTest} from '../../models/prepare-page-test';
import {QuestionPageTest} from '../../models/question-page-test';

@Component({
  selector: 'page-test',
  templateUrl: 'page-test.html'
})

export class PageTest implements OnInit, OnChanges {
  @Input() containerPage: object;
  @Output() nextPage: EventEmitter<any> = new EventEmitter();
  preparePage: PreparePageTest;
  questionPage: QuestionPageTest;

  constructor() { }

  ngOnInit() {
    this.determinateTypePage();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.determinateTypePage();
  }

  determinateTypePage() {
    this.preparePage = null;
    this.questionPage = null;
    if(this.containerPage) {
      if(typeof(this.containerPage['idPage']) === 'string') {
        this.preparePage = this.containerPage as PreparePageTest;
      } else
      if(typeof(this.containerPage['idQuestion']) === 'string') {
        this.questionPage = this.containerPage as QuestionPageTest;
      }
    }
  }
}
