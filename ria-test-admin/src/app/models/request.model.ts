export interface IRequestModel {
  _id: string;
  owner: string;
  title: string;
  isFinished: boolean;
  phoneNumber: string;
  name: string;
  company: string;
  riskGroups: object;
}
