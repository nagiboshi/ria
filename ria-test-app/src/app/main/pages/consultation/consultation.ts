import {Component, Input, OnInit} from '@angular/core';
import {IUserModel} from "../../../common/models/user";
import {AuthService} from "../../../common/services/auth.service";
import {RequestService} from "../../../common/services/request.service";
import {ToastController} from "ionic-angular";

@Component({
  selector: 'consultation-page',
  templateUrl: 'consultation.html'
})

export class ConsultationPage implements OnInit {

  @Input() title;
  @Input() phoneNumber;
  @Input() name;

  constructor(
    private _authService: AuthService,
    private _requestService: RequestService,
    private _toast: ToastController
  ) {}

  ngOnInit() {
    this._authService
      .getUser()
      .subscribe((user: IUserModel) => {
        if (user && user.phoneNumber) {
          this.phoneNumber = user.phoneNumber;
        }

        if (user && user.name) {
          this.name = user.name;
        }
      });
  }

  createRequest() {
    if (!this.title || !this.name || !this.phoneNumber) {
      return;
    }

    this._requestService
      .createRequest(this.title, this.name, this.phoneNumber)
      .subscribe(
        () => {
          this.title = '';
          this.name = '';
          this.phoneNumber = '';

          this._toast.create({
            message: 'Заявка на консультацию была успешно создана',
            position: 'top',
            duration: 3000
          }).present();
        },
        console.error
      );
  }

}
