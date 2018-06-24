import { Component, OnInit, OnDestroy  } from '@angular/core';
import { AuthService } from "../../../common/services/auth.service";
import { ModalController, NavController} from "ionic-angular";
import { SignInPage } from "../sign-in/sign-in";
import {IUserModel} from "../../../common/models/user";
import {FieldUpdate} from "../../../common/models/field-update";
import {ModalChangeFields} from "../../../common/components/modal-change-fields/modal-change-fields";

@Component({
  selector: 'account-page',
  templateUrl: 'account.html'
})

export class AccountPage implements OnInit, OnDestroy {
  private user: IUserModel;
  private subList = [];

  constructor(
    private _authService: AuthService,
    private _navCtrl: NavController,
    public modalCtrl: ModalController
  ) {}

  isOnPushApp = true;
  isOnPushEmail = true;

  ngOnInit() {
    this.subList.push(
      this._authService.getUser()
        .subscribe((user) => {
          if(user) {
            this.user = user;
          }
        })
    );
  }

  signOut() {
    this._authService
      .signOut()
      .subscribe(() => this._navCtrl.setRoot(SignInPage));
  }

  changeName() {
    let objUpdate = new FieldUpdate({
      name: 'name',
      title: 'Имя пользователя'
    });
    let nameChangeModal = this.modalCtrl.create(ModalChangeFields, {
      listFields: [objUpdate]
    });
    nameChangeModal.present();
  }

  changePhoneNumber() {
    let objUpdate = new FieldUpdate({
      name: 'phoneNumber',
      title: 'Телефонный номер'
    });
    let phoneChangeModal = this.modalCtrl.create(ModalChangeFields, {
      listFields: [objUpdate]
    });
    phoneChangeModal.present();
  }

  ngOnDestroy() {
    this.subList.forEach(subItem => {
      subItem.unsubscribe();
    })
  }
}
