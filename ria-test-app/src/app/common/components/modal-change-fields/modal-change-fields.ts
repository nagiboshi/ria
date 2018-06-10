import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { NavController, NavParams, ToastController , ViewController} from "ionic-angular";
import {IUserModel} from "../../models/user";
import {Input} from "@angular/core";
import {FieldUpdate} from "../../models/field-update";
import {AccountPage} from "../../../main/pages/account/account";

@Component({
  selector: 'modal-change-fields',
  templateUrl: 'modal-change-fields.html'
})

export class ModalChangeFields implements OnInit, OnDestroy {

  @Input() listFields: FieldUpdate[];
  private user: IUserModel;
  private subList = [];
  fieldsValues = {};

  constructor(
    private _authService: AuthService,
    private _navCtrl: NavController,
    private params: NavParams,
    private _toastCtrl: ToastController,
    public viewCtrl: ViewController
  ) { }

  ngOnInit() {
    this.subList.push(
      this._authService.getUser()
        .subscribe((user) => {
          if(user) {
            this.user = user;
            this.prepareViewData();
          }
        })
    );
  }

  prepareViewData() {
    if(this.params) {
      this.listFields = this.params.get('listFields');
      this.listFields.forEach(itemField => {
        if(itemField.name) {
          this.fieldsValues[itemField.name] = this.user[itemField.name] || '';
        }
      })
    }
  }

  validDataField(userData, updateData) {
    if(!userData || !updateData) {
      return false;
    }
    return userData !== updateData && updateData !== '';
  }

  saveFields() {
    let isSendRequest = false;
    let updateObjUser = {
      "_id": this.user.id
    };
    this.listFields.forEach(itemField => {
      if(this.validDataField(this.user[itemField.name], this.fieldsValues[itemField.name])) {
        updateObjUser[itemField.name] = this.fieldsValues[itemField.name];
        isSendRequest = true;
      }
    });
    if(isSendRequest) {
      this.subList.push(
        this._authService.updateUser(updateObjUser)
          .subscribe(() => {
            this.viewCtrl.dismiss();
          }, error => {
            let params = {
              message: 'Данные не были обновлены',
              position: 'top',
              duration: 3000
            };
            this._toastCtrl
              .create(params)
              .present();
          })
      );
    } else {
      this.viewCtrl.dismiss();
    }
  }

  ngOnDestroy() {
    this.subList.forEach(subItem => {
      subItem.unsubscribe();
    })
  }

}
