import { BaseComponent } from './components/base/base.component';
import { NgModule } from '@angular/core';
import {
  MatToolbarModule, MatButtonModule, MatIconModule, MatTableModule, MatCardModule, MatListModule, MatSidenavModule, MatFormFieldModule,
  MatInputModule, MatCheckboxModule,
  MatDialogModule,
  MatSelectModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ComaSeparatedRisks } from '../pipes/comaSeparatedRisks.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RiskGroupService } from '../services/riskGroup.service';
const modules = [
  CommonModule,
  BrowserModule,
  FormsModule,
  MatCardModule,
  MatTableModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatButtonModule,
  MatToolbarModule,
  MatListModule,
  MatSelectModule,
  MatSidenavModule,
  FlexLayoutModule,
  MatInputModule,
  MatDialogModule,
  MatFormFieldModule,
  MatCheckboxModule,
  RouterModule
];

const components = [
  BaseComponent, ComaSeparatedRisks
];

@NgModule({
  imports: [...modules],
  exports: [...modules, ...components],
  declarations: [...components],
  providers: [ RiskGroupService ],
})
export class SharedModule { }
