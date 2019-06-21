import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { filter } from 'minimatch';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Nothing selected';
  public isLoading = false;
  file: File;

  dataSource;

  worker = new Worker('./excel-worker.worker', { type: 'module' });
  constructor() {
    this.worker.onmessage = event => {
      this.isLoading = false;
      this.dataSource = new MatTableDataSource(event.data);
    };
  }
  incomingFile(event: { target: { files: File[] } }) {
    this.file = event.target.files[0];
    console.log(this.file.name);
    this.title = `Selected ${this.file.name}`;
    this.worker.postMessage(this.file);
    this.isLoading = true;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
