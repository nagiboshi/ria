import { BaseComponent } from './components/base/base.component';
import { NgModule } from '@angular/core';
import {
  MatToolbarModule, MatButtonModule, MatIconModule, MatTableModule, MatCardModule, MatListModule, MatSidenavModule, MatFormFieldModule,
  MatInputModule, MatCheckboxModule,
  MatDialogModule
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

const modules = [
  CommonModule,
  BrowserModule,
  FormsModule,
  MatCardModule,
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatListModule,
  MatSidenavModule,
  MatInputModule,
  MatDialogModule,
  MatFormFieldModule,
  MatCheckboxModule,
  RouterModule
];

const components = [
  BaseComponent
];

@NgModule({
  imports: [...modules],
  exports: [...modules, ...components],
  declarations: [...components],
  providers: [],
})
export class SharedModule { }
