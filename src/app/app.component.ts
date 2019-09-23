import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { EniWindowService } from './eni-window/eni-window.service';
import { ContentOneComponent } from './content-one/content-one.component';
import { ContentTwoComponent } from './content-two/content-two.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'window-service';
  @ViewChild('testTemplate', { static: true }) testTemplate: TemplateRef<any>;

  constructor(public dialog: EniWindowService) {}

  ngOnInit() {}

  showModalOne() {
    this.dialog.open(ContentOneComponent, { id: 'KKS_1', data: { text: 'Hello world!' } });
  }

  showModalTwo() {
    this.dialog.open(this.testTemplate, { data: { text: 'Test dialog from template!' } });
  }
}
