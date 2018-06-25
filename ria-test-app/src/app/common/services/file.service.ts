import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

@Injectable()
export class FileService {
  constructor(
    public _file: File,
    private _fileOpener: FileOpener
  ) {}

  getFreeDiskSpace(): Promise<number> { 
    return this._file.getFreeDiskSpace();
  }
  
  writeFile(fileName: string, fileBlob: any) {
    console.log("fileBlob", fileBlob);
    console.log("this._file", this._file);
    let fs = this._file.externalDataDirectory;
    console.log("fs", fs);
    let options = {
      replace: true
    };
    
    this._file.writeFile(fs, fileName, fileBlob, options)
        .then(entry => {
        console.log("entry", entry);
        if(entry.nativeURL) {
            this._fileOpener.open(entry.nativeURL, 'application/pdf')
              .then(() => console.log('File is opened'))
              .catch(e => console.log('Error opening file', e));           
            }
        })
      } 
   


  // saveFileLocal(window, file, fileName) {
  //   window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
  //   window.requestFileSystem(window.TEMPORARY, 20 * 1024 * 1024, (fs) => {
  //     fs.root.getFile('report-test.pdf', { create: true, exclusive: false }, (fileEntry) => {
  //
  //       this.writeFile(fileEntry, file);
  //
  //     }, error => {
  //       console.log("error=", error);
  //     });
  //   }, error => {
  //     console.log("error=", error);
  //   });
  // }
  //
  // writeFile(fileEntry, dataObj) {
  //   // Create a FileWriter object for our FileEntry (log.txt).
  //   fileEntry.createWriter((fileWriter) => {
  //
  //     fileWriter.onwriteend = () => {
  //       console.log("Successful file write...");
  //       this.readFile(fileEntry);
  //     };
  //
  //     fileWriter.onerror = (e) => {
  //       console.log("Failed file write: " + e.toString());
  //     };
  //
  //     // If data object is not passed in,
  //     // create a new Blob instead.
  //     if (dataObj) {
  //       fileWriter.write(dataObj);
  //     }
  //   });
  // }
  //
  // readFile(fileEntry) {
  //   fileEntry.file((file) => {
  //     let reader = new FileReader();
  //
  //     reader.onloadend = () => {
  //       console.log("loaded");
  //     };
  //
  //     reader.readAsText(file);
  //
  //   }, error => {
  //     console.log("error=", error);
  //   });
  // }

}
