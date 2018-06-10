import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {QuestionPageTest} from '../../models/question-page-test';
import {ToastController} from "ionic-angular";
import {AnswerTest} from '../../models/answer-test';

@Component({
  selector: 'list-radiogroup-question',
  templateUrl: 'list-radiogroup-question.html'
})

export class ListRadiogroupQuestion implements OnInit, OnChanges {
  @Input() question: QuestionPageTest;
  @Output() nextPage: EventEmitter<any> = new EventEmitter();
  listQuestion: QuestionPageTest[] = [];

  constructor(
    private _toastCtrl: ToastController
  ) { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.prepareListQuestion();
  }

  prepareListQuestion() {
    this.listQuestion = [];
    if(this.question.listVariants) {
      let listAnswer = this.question.listVariants.map((element, index) => {
        return ({
          id: String(index + 1),
          text: element
        } as AnswerTest);
      });
      this.question.answers.forEach(answer => {
        let objQuestion = ({
          idQuestion: this.question.idQuestion + ':' + answer.id,
          type: 'radiogroup',
          text: answer.text,
          answers: listAnswer,
          select: null
        } as QuestionPageTest);
        this.listQuestion.push(objQuestion);
      });
    } else {
      this.question.select = null;
      this.listQuestion.push(this.question);
    }
  }

  submitResults() {
    if(this.validateData()) {
      let result: string[] = [];

      this.listQuestion.forEach(question => {
        result.push(question.idQuestion + ':' + question.select['id']);
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
    let isValidData = true;
    this.listQuestion.forEach(question => {
      if(!question.select) {
        isValidData = false;
      }
    });
    return isValidData;
  }
}
