import { Component, OnInit, OnDestroy } from '@angular/core';
import {TestService} from '../../../common/services/test.service';
import {Test} from '../../../common/models/test';
import {ReportTest} from '../../../common/models/report-test';
import {NavController, ToastController} from "ionic-angular";
import {FileService} from "../../../common/services/file.service";
import {CurrentTestPage} from './current-test/current-test';
import * as FileSaver from 'file-saver';
import { Platform } from 'ionic-angular';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: 'tests-page',
  templateUrl: 'tests.html'
})

export class TestsPage implements OnInit, OnDestroy {

  listTests: Test[] = [];
  listReport: ReportTest[] = [];
  listSubscribe = [];
  isLoadTests: boolean = false;
  isLoadReports: boolean = false;
  constructor(
    private _navCtrl: NavController,
    private _toastCtl: ToastController,
    private testService: TestService,
    private fileService: FileService,
    public plt: Platform
  ) { }

  ngOnInit() {
    this.loadTests();
    this.loadReportLocal();
  }

  ngOnDestroy() {
    this.listSubscribe.forEach(sub => {
      sub.unsubscribe();
    })
  }

  loadTests() {
    this.isLoadTests = true;
    this.isLoadReports = true;
    let objSubTestLocal = this.testService.getTestsLocal()
    .subscribe((result) => {
      this.isLoadTests = false;
      this.listTests = result;
        this.listTests.forEach(test => {
          let subReportTest = this.testService.getReportTest(test.testId)
            .subscribe(result => {
              this.isLoadReports = false;
              subReportTest.unsubscribe();
            }, error => {
              subReportTest.unsubscribe();
              this.isLoadReports = false;
            })
        })
      });
    this.listSubscribe.push(objSubTestLocal);
  }

  loadReportLocal() {
    let objSubReportTestsLocal = this.testService.getReportTestsLocal()
      .subscribe(listReport => {
        this.listReport = listReport;
        this.addReportsToTests();
      });
    this.listSubscribe.push(objSubReportTestsLocal);
  }

  addReportsToTests() {
    this.listReport.forEach(report => {
      this.listTests.forEach(test => {
        if(test.testId === report.idTest) {
          test.resultPdf = report.data;
        }
      })
    })
  }

  goToCurrentTest(testId) {
    this._navCtrl.push(CurrentTestPage, {
      id: testId
    });
  }

  loadResultTest(resultPdf) {
    if(resultPdf) {
      if(!this.plt.is('core')) {
        this.plt.ready()
          .then((readySource) => {
            console.log('Platform ready from', readySource);
            
            this.fileService.getFreeDiskSpace().then((freeSpace:number) => { 
              console.log('free space : ', freeSpace);
              console.log('pdf-size', resultPdf.size);
              if( freeSpace > resultPdf.size ) { 
                this.fileService.writeFile('report-test.pdf', resultPdf);
              } else { 
                const toastOptions = { 
                  message: 'Недостаточно места на устройстве. Невозможно сохранить файл',
                  position: 'top',
                  duration: 3000
                };
                this._toastCtl.create(toastOptions).present();
              }
            })
          });
      } else {
        console.log("???");
        FileSaver.saveAs(resultPdf, 'report-test.pdf');
        
      }
    }
  }
}
