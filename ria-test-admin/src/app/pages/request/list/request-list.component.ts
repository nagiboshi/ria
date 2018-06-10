import { RequestService } from './../../../services/request.service';
import { IRequestModel } from './../../../models/request.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-list',
  templateUrl: 'request-list.component.html',
  styleUrls: ['request-list.component.css']
})

export class RequestListComponent implements OnInit {

  requests: IRequestModel[] = [];
  displayedColumns = ['isFinished', 'title', 'name', 'phone', 'email', 'company'];

  constructor(
    private _requestService: RequestService
  ) {}

  ngOnInit() {
    this._requestService.getRequests().subscribe((requests: IRequestModel[]) => {
      this.requests = requests;
    });
  }

  switchFinished(request) {
    request.isFinished = !request.isFinished;
    this._requestService.updateRequestById(request);
  }
}
