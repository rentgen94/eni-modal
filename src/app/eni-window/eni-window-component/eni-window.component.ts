import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  Input,
  ViewContainerRef,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'eni-window',
  templateUrl: './eni-window.component.html'
})
export class EniWindowComponent implements OnInit {
  @Input() cfr: ComponentFactoryResolver;
  @ViewChild('eniWindowBody', { static: false }) eniWindowBody: ViewContainerRef;

  constructor() {}

  ngOnInit() {}

  attachContent(windowContent: ComponentType<any>) {
    const compFactory = this.cfr.resolveComponentFactory(windowContent);
    const componentRef = this.eniWindowBody.createComponent(compFactory);
    componentRef.changeDetectorRef.detectChanges();
  }
}
