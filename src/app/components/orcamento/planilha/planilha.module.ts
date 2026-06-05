import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanilhaComponent } from './planilha.component';
import { AgGridModule } from 'ag-grid-angular';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PlanilhaComponent],
  exports: [PlanilhaComponent],
  imports: [CommonModule, BrowserModule, AgGridModule, FormsModule],
})
export class PlanilhaModule {}
