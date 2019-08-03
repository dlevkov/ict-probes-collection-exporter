import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataProviderService {
  worker = new Worker('./excel-worker.worker', { type: 'module' });
  private subj = new Subject<any[]>();

  constructor() {
    this.worker.onmessage = event => {
      this.subj.next(event.data);
    };
  }

  public onMessage$(): Observable<any[]> {
    return this.subj.asObservable();
  }
  public processFile(file: File): void {
    this.worker.postMessage(file);
  }
}
