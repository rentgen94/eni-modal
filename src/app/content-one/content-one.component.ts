import { Component, OnInit, Inject } from '@angular/core';
import { ENI_WINDOW_DATA, EniWindowConfig } from '../eni-window/eni-window.config';

@Component({
  selector: 'app-content-one',
  templateUrl: './content-one.component.html',
  styleUrls: ['./content-one.component.scss']
})
export class ContentOneComponent implements OnInit {
  test = 'test';

  constructor(@Inject(ENI_WINDOW_DATA) public data: any) {}

  ngOnInit() {
    this.test = this.data.text;
  }
}
