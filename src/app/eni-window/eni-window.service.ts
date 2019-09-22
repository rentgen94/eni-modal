/* tslint:disable: variable-name */
import {
  Injectable,
  ViewContainerRef,
  Inject,
  TemplateRef,
  ComponentFactoryResolver,
  ComponentRef
} from '@angular/core';
import { EniWindowRef } from './eni-window-ref';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { EniWindowsContainerComponent } from './eni-windows-container/eni-windows-container';
import { EniWindowComponent } from './eni-window-component/eni-window.component';

@Injectable({
  providedIn: 'root'
})
export class EniWindowService {
  private _openWindows: Map<string, EniWindowRef<any>> = new Map<string, EniWindowRef<any>>();
  private _overlayRef: OverlayRef;
  private _windowsContainerViewRef: ViewContainerRef;

  constructor(
    private _overlay: Overlay,
    protected componentFactoryResolver: ComponentFactoryResolver,
    @Inject(DOCUMENT) public document: Document
  ) {}

  open(windowContent: TemplateRef<any> | ComponentType<any> | string, windowConfig?: any) {
    if (this.shouldCreateWindowsContainer()) {
      this.createWindowsContainer();
    }

    const windowRef = new EniWindowRef();
    windowRef.componentInstance = this.appendWindow(windowContent);

    this._openWindows.set(windowRef.id, windowRef);
  }

  protected shouldCreateWindowsContainer(): boolean {
    if (this._windowsContainerViewRef) {
      const containerEl = this._windowsContainerViewRef.element.nativeElement;
      return !this.document.body.contains(containerEl);
    }

    return true;
  }

  protected createWindowsContainer() {
    if (this._overlayRef) {
      this._overlayRef.dispose();
    }

    this._overlayRef = this._overlay.create(this._getOverlayConfig());
    const windowsContainerPortal = new ComponentPortal(EniWindowsContainerComponent);
    const overlayRef = this._overlayRef.attach(windowsContainerPortal);

    this._windowsContainerViewRef = overlayRef.instance.eniWindowsContainer;
  }

  protected appendWindow(
    windowContent: TemplateRef<any> | ComponentType<any> | string
  ): ComponentRef<EniWindowComponent> {
    const windowFactory = this.componentFactoryResolver.resolveComponentFactory(EniWindowComponent);
    const ref = this._windowsContainerViewRef.createComponent(windowFactory);
    ref.instance.cfr = this.componentFactoryResolver;
    ref.instance.attachContent(windowContent as ComponentType<any>);
    ref.changeDetectorRef.detectChanges();
    return ref;
  }

  private _getOverlayConfig() {
    const state = new OverlayConfig({
      positionStrategy: this._overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      scrollStrategy: this._overlay.scrollStrategies.noop()
    });

    return state;
  }
}
