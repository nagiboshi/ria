import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {QuestionPageTest} from '../../models/question-page-test';
import {ToastController} from "ionic-angular";

@Component({
  selector: 'input-question',
  templateUrl: 'input-question.html'
})

export class InputQuestion implements OnInit{
  @Input() question: QuestionPageTest;
  @Output() nextPage: EventEmitter<any> = new EventEmitter();
  valueInput: string = '';

  constructor(
    private _toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }

  submitResults() {
    if(this.validateData()) {
      this.nextPage.emit([this.question.idQuestion + ':' + this.valueInput]);
      this.valueInput = '';
    } else {
      this._toastCtrl.create(
        {
          message: 'Заполните поле',
          position: 'top',
          duration: 3000
        }).present();
    }
  }

  validateData() {
    return typeof(this.valueInput) === 'string' && this.valueInput.length > 0;
  }

}
