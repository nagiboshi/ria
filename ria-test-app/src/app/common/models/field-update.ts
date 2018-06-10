export class FieldUpdate {
  name: string;
  title: string;

  constructor(obj) {
    if(obj.name) {
      this.name = obj.name;
    }
    if(obj.title) {
      this.title = obj.title;
    }
  }
}