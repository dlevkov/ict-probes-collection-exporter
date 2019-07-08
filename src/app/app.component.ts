import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class AppComponent {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  title = 'Nothing selected';
  public isLoading = false;
  public dataAvailable = false;
  file: File;
  public data: any;
  dataSource: MatTableDataSource<any>;

  worker = new Worker('./excel-worker.worker', { type: 'module' });
  expandedElement: any | null;
  constructor() {
    this.handleWorkerMessage();
  }

  private handleWorkerMessage() {
    this.worker.onmessage = event => {
      this.isLoading = false;
      this.dataAvailable = true;
      this.dataSource = new MatTableDataSource(event.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    };
  }

  incomingFile(event: { target: { files: File[] } }) {
    this.file = event.target.files[0];
    this.title = `Selected ${this.file.name}`;
    this.worker.postMessage(this.file);
    this.isLoading = true;
    this.dataAvailable = false;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  handleRowClick(evt) {
    console.log(evt);
    this.data = evt;
  }
}
