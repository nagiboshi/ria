import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: 'auth.component.html',
  styleUrls: [ 'auth.component.css' ]
})

export class AuthComponent implements OnInit {

  public errorMessage: string;

  constructor(
    private _auth: AuthService,
    private _router: Router
  ) {}

  ngOnInit() {}

  signIn(formData: NgForm): void {
    const { email, password } = formData.form.value;
    this._auth.signIn(email, password)
      .then(() => this._router.navigateByUrl('/user'))
      .catch(err => {
        switch (err.code) {
          case 2001:
            this.errorMessage = 'Пользователь с таким email не найден';
            break;
          case 2004:
            this.errorMessage = 'Неверная пара email/пароль';
            break;
          case 2005:
            this.errorMessage = 'Неверный формат email';
            break;
          case 5002:
            this.errorMessage = 'Доступ закрыт';
            break;
          default: return console.error(err);
        }
        setTimeout(() => this.errorMessage = '', 5000);
      });
  }

}
