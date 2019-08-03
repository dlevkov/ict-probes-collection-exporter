import { NgModule } from '@angular/core';
import {
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatRippleModule,
  MatCardModule,
  MatProgressBarModule,
  MatSortModule,
  MatDividerModule,
  MatPaginatorModule,
} from '@angular/material';

const modules = [
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatRippleModule,
  MatCardModule,
  MatProgressBarModule,
  MatSortModule,
  MatDividerModule,
  MatPaginatorModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {}
