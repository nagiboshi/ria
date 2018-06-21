import { IRiskGroup } from './riskgroup.model';
export interface IArticleModel {
  _id: string;
  title: string;
  body: string;
  image: string;
  riskGroups: IRiskGroup[];
}
