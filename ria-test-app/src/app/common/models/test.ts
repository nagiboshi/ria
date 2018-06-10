import {QuestionPageTest} from './question-page-test';
import {PreparePageTest} from './prepare-page-test';

export class Test {
  title: String;
  testId: String;
  listQuestions: QuestionPageTest[];
  preparePages: PreparePageTest[];
  resultPdf?: Blob;
}
