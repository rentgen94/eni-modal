import { Component, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'eni-windows-container',
  templateUrl: './eni-windows-container.html',
  styleUrls: ['./eni-windows-container.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EniWindowsContainerComponent {
  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;
}
