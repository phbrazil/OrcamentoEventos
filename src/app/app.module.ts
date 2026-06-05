import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlanilhaComponent } from './components/orcamento/planilha/planilha.component';
import { PlanilhaModule } from './components/orcamento/planilha/planilha.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, PlanilhaModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
