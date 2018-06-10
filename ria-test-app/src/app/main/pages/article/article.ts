import { Component, OnInit } from '@angular/core';
import { NavController, NavParams} from "ionic-angular";

@Component({
  selector: 'article-page',
  templateUrl: 'article.html'
})

export class ArticlePage implements OnInit {

  listArticles = [
    {
      id: '000001',
      title: 'Рекомендации по бегу',
      text: 'При беге на небольшие дистанции очень важно уделять внимание дыханию',
      link: 'https://look.com.ua/pic/201209/1920x1200/look.com.ua-3605.jpg'
    },
    {
      id: '000002',
      title: 'Рекомендации по бегу',
      text: 'При беге на небольшие дистанции очень важно уделять внимание дыханию',
      link: 'http://sportizdorovie.ru/wp-content/uploads/2017/07/%D0%91%D0%B5%D0%B3-%D0%BD%D0%B0-%D0%BF%D1%80%D0%B8%D1%80%D0%BE%D0%B4%D0%B5.jpg'
    },
    {
      id: '000003',
      title: 'Рекомендации по бегу',
      text: 'При беге на небольшие дистанции очень важно уделять внимание дыханию',
      link: 'https://wallpaperscraft.ru/image/sportsmen_beg_gory_chb_117730_1920x1080.jpg'
    }
  ];
  viewArticle = {
    id: '',
    title: '',
    text: '',
    link: ''
  };

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams
  ) { }

  ngOnInit() {
    let idArticle = this._navParams.get('id');
    this.listArticles.forEach(itemArticle => {
      if(itemArticle.id === idArticle) {
        this.viewArticle = itemArticle;
      }
    })
  }


}
