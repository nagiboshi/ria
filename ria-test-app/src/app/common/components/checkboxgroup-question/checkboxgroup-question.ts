import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {ToastController} from "ionic-angular";

import {QuestionPageTest} from '../../models/question-page-test';

@Component({
  selector: 'checkboxgroup-question',
  templateUrl: 'checkboxgroup-question.html'
})

export class CheckboxgroupQuestion implements OnInit, OnChanges {
  @Input() question: QuestionPageTest;
  @Output() nextPage: EventEmitter<any> = new EventEmitter();

  constructor(
    private _toastCtrl: ToastController
  ) { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.prepareListQuestion();
  }

  prepareListQuestion() {
    this.question.answers.forEach(answer => {
      answer.select = false;
    })
  }

  submitResults() {
    if(this.validateData()) {
      let result: string[] = [];
      this.question.answers.forEach(answer => {
        if(answer.select) {
          result.push(this.question.idQuestion + ':' + answer.id);
        }
      });
      this.nextPage.emit(result);
    } else {
      this._toastCtrl.create(
        {
          message: 'Заполните все поля',
          position: 'top',
          duration: 3000
        }).present();
    }
  }

  validateData() {
    return true;
  }
}

