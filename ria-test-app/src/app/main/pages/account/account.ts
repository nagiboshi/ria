import { Component, OnInit, OnDestroy  } from '@angular/core';
import { AuthService } from "../../../common/services/auth.service";
import { ModalController, NavController} from "ionic-angular";
import { SignInPage } from "../sign-in/sign-in";
import {IUserModel} from "../../../common/models/user";
import {FieldUpdate} from "../../../common/models/field-update";
import {ModalChangeFields} from "../../../common/components/modal-change-fields/modal-change-fields";
import {FcmService} from "../../../common/services/fcm.service";
@Component({
  selector: 'account-page',
  templateUrl: 'account.html'
})

export class AccountPage implements OnInit, OnDestroy {
  private user: IUserModel;
  private subList = [];
  pushByPhone = true;
  pushByEmail = true;
  constructor(
    private _authService: AuthService,
    private _navCtrl: NavController,
    private _fcmService: FcmService,
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.subList.push(
      this._authService.getUser()
        .subscribe((user) => {
          if(user) {
            this.user = user;
            this.pushByPhone = this.user.pushByPhone;
            this.pushByEmail = this.user.pushByEmail;
          }
        })
    );
  }

  signOut() {
    this._authService
      .signOut()
      .subscribe(() => { 
        this._navCtrl.setRoot(SignInPage);
        this._fcmService.stopListeningNotifications("articles");
      }

    );
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
