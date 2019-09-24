import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ENI_WINDOW_DATA, EniWindowConfig } from '../eni-window/eni-window.config';

@Component({
  selector: 'app-content-one',
  templateUrl: './content-one.component.html',
  styleUrls: ['./content-one.component.scss']
})
export class ContentOneComponent implements OnInit, OnDestroy {
  test = 'test';
  interval: any;

  constructor(@Inject(ENI_WINDOW_DATA) public data: any, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.test = this.data.text;

    this.interval = setInterval(() => {
      this.test = Math.random().toFixed(2);
      this.cd.detectChanges();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
