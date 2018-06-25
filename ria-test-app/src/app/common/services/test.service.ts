import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {Observable} from "rxjs/Observable";
import {ReplaySubject} from 'rxjs/ReplaySubject';

import {Test} from '../models/test';
import {ReportTest} from '../models/report-test';

@Injectable()
export class TestService {
  private _tests: ReplaySubject<Test[]> = new ReplaySubject(1);
  tests: Test[] = [];
  isLoadTests: Boolean = false;
  private _reportList: ReplaySubject<ReportTest[]> = new ReplaySubject(1);
  reportList: ReportTest[] = [];
  isLoadReports: Boolean = false;

  constructor(
    private _api: ApiService
  ) {}

  setTestsLocal(listTests) {
    if(listTests) {
      this._tests.next(listTests);
      this.tests = listTests;
      this.isLoadTests = true;
    } else {
      this.isLoadTests = false;
    }
  }
  
  setReportLocal(reportList) {
    if(reportList) {
      this._reportList.next(reportList);
      this.reportList = reportList;
      this.isLoadReports = true;
    } else {
      this.isLoadReports = false;
    }
  }

  getTestsLocal(): Observable<Test[]> {
    if(this.isLoadTests) {
      return this._tests.asObservable();
    } else {
      return this.getTests();
    }
  }

  getTests(): Observable<Test[]> {
    return this._api.get('tests/')
      .flatMap((result) => {
        let listTests = [];
        if (result) {
          listTests = JSON.parse(result);
          this.setTestsLocal(listTests);
        }
        return this._tests.asObservable();
      });
  }

  getTestResults() {
    return this._api.get('tests/result/')
      .map((result) => {
        return result;
      });
  }

  getTestResultsByIdTest(testId) {
    return this._api.get('tests/result-by-id/', {testId: testId})
      .map((result) => {
        return result;
      });
  }

  newResultTest(testId, data) {
    return this._api.post('tests/new-result/', {testId: testId, result: data})
      .flatMap((result) => {
        let listTests = [];
        if (result) {
          listTests = JSON.parse(result);
          this.setTestsLocal(listTests);
        }
        return this._tests.asObservable();
      });
  }

  getReportTestsLocal() {
    return this._reportList.asObservable();
  }

  getReportTest(testId) {
    return this._api.get('tests/report/', {testId: testId})
      .map((result) => {
        let reportData = new Blob([new Uint8Array(result.data)], {
          type: 'application/pdf' // must match the Accept type
        });
        let objReport = {
          idTest: testId,
          data: reportData
        };
        let isFindReportTest = false;
        for(let i = 0; i < this.reportList.length; i++) {
          if(this.reportList[i].idTest === testId) {
            this.reportList[i] = objReport;
            isFindReportTest = true;
          }
        }
        if(!isFindReportTest) {
          this.reportList.push(objReport);
        }
        this.setReportLocal(this.reportList);
        return objReport;
      });
  }

  getTestWithCurrentId(idTest) {
    let listTests = this.tests.filter(test => {
      return test.testId === idTest;
    });
    return (Array.isArray(listTests) && listTests.length > 0) ? listTests[0] : null;
  }

}
