import { Injectable } from '@angular/core';

@Injectable()
export class ModalService {
  _modal = null;

  setModal(modal) {
    this._modal = modal;
  }

  close() {
    if (this._modal) {
      this._modal.close();
      this._modal = null;
    }
  }
}
