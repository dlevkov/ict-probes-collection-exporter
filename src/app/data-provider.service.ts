import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  private subj$ = new Subject<any[]>();


  public onMessage$(): Observable<any[]> {
    return this.subj$.asObservable();
  }
  public processFile(file: File): void{
    const fileReader = new FileReader();
    fileReader.onload = e => {
      const arrayBuffer: any = fileReader.result;
      const data = new Uint8Array(arrayBuffer);
      const arr = new Array();
      for (let i = 0; i != data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const result = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.subj$.next(result);
    };
    fileReader.readAsArrayBuffer(file);
  }
}
