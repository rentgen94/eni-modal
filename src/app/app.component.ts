import { Component } from '@angular/core';
import { EniWindowService } from './eni-window/eni-window.service';
import { ContentOneComponent } from './content-one/content-one.component';
import { ContentTwoComponent } from './content-two/content-two.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'window-service';

  constructor(public dialog: EniWindowService) {}

  showModalOne() {
    this.dialog.open(ContentOneComponent);
  }

  showModalTwo() {
    this.dialog.open(ContentTwoComponent);
  }
}
