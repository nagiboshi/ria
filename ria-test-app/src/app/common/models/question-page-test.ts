import {AnswerTest} from './answer-test';

export class QuestionPageTest {
  idQuestion: string;
  type: string;
  text: string;
  answers: AnswerTest[];
  listVariants?: string[];
  done?: boolean;
  select?: object;
}