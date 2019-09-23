import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ContentOneComponent } from './content-one/content-one.component';
import { ContentTwoComponent } from './content-two/content-two.component';
import { EniWindowModule } from './eni-window/eni-window.module';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  declarations: [AppComponent, ContentOneComponent, ContentTwoComponent],
  imports: [BrowserModule, EniWindowModule, PortalModule],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ContentOneComponent, ContentTwoComponent]
})
export class AppModule {}
