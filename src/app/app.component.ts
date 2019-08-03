import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DataProviderService } from './data-provider.service';
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
      ),
    ]),
  ],
})
export class AppComponent {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  columnsToDisplay = ['Board P/N', 'Board Name', 'ICT-Test-Adapter P/N'];
  keyColumn = this.columnsToDisplay[0];

  title = 'Nothing selected';
  public isLoading = false;
  public dataAvailable = false;
  file: File;
  public data: any;
  dataSource: MatTableDataSource<any>;

  expandedElements: any[] | null = [];
  constructor(private service: DataProviderService) {
    this.handleWorkerMessage();
  }

  private handleWorkerMessage() {
    this.service
      .onMessage$()
      .subscribe(data => {
        this.isLoading = false;
        this.dataAvailable = true;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  incomingFile(event: { target: { files: File[] } }) {
    this.file = event.target.files[0];
    this.title = `Selected ${this.file.name}`;
    this.service.processFile(this.file);
    this.isLoading = true;
    this.dataAvailable = false;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  setElement(element: { [x: string]: string }): void {
    if (this.elementFound(element)) {
      this.expandedElements = this.expandedElements.filter(
        x => x[this.keyColumn] !== element[this.keyColumn]
      );
      return;
    }
    this.add(element);
  }
  elementFound(element: { [x: string]: string }): boolean {
    return this.expandedElements.some(
      x => x[this.keyColumn] === element[this.keyColumn]
    );
  }

  private add(element: { [x: string]: string }) {
    this.expandedElements.push(element);
  }
}
