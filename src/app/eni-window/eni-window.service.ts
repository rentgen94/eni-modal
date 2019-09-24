/* tslint:disable: variable-name */
import { Injectable, Inject, TemplateRef, ComponentFactoryResolver, ComponentRef, Injector } from '@angular/core';
import { EniWindowRef } from './eni-window-ref';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { EniWindowsContainerComponent } from './eni-windows-container/eni-windows-container';
import { EniWindowComponent } from './eni-window-component/eni-window.component';
import { EniWindowConfig, ENI_WINDOW_CONTENT, ENI_WINDOW_CONFIG } from './eni-window.config';

@Injectable({
  providedIn: 'root'
})
export class EniWindowService {
  private _openWindows: Map<string, EniWindowRef<any>> = new Map<string, EniWindowRef<any>>();
  private _overlayRef: OverlayRef;
  private _windowsContainer: ComponentRef<EniWindowsContainerComponent>;

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
    protected componentFactoryResolver: ComponentFactoryResolver,
    @Inject(DOCUMENT) public document: Document
  ) {}

  open<T, D = any, R = any>(
    windowContent: TemplateRef<T> | ComponentType<T> | string,
    windowConfig?: EniWindowConfig<D>
  ): EniWindowRef<T, R> {
    if (this.shouldCreateWindowsContainer()) {
      this._windowsContainer = this._attachWindowsContainer(windowConfig);
    }

    if (windowConfig.id && this.getWindowById(windowConfig.id)) {
      throw Error(`Dialog with id "${windowConfig.id}" exists already. The dialog id must be unique.`);
    }

    const windowRef = this._attachWindowContent<T, R>(windowContent, this._windowsContainer.instance, windowConfig);

    this._openWindows.set(windowRef.id, windowRef);
    windowRef.afterClosed().subscribe(() => this._removeWindow(windowRef.id));

    return windowRef;
  }

  getWindowById(id: string): EniWindowRef<any> | undefined {
    return this._openWindows.has(id) ? this._openWindows.get(id) : undefined;
  }

  protected shouldCreateWindowsContainer(): boolean {
    if (this._windowsContainer) {
      const containerEl = this._windowsContainer.instance.viewContainerRef.element.nativeElement;
      return !this.document.body.contains(containerEl);
    }

    return true;
  }

  protected _attachWindowsContainer(config: EniWindowConfig): ComponentRef<EniWindowsContainerComponent> {
    if (this._overlayRef) {
      this._overlayRef.dispose();
    }

    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
    const injector = new PortalInjector(userInjector || this._injector, new WeakMap([[EniWindowConfig, config]]));

    this._overlayRef = this._overlay.create(this._getOverlayConfig());
    const windowsContainerPortal = new ComponentPortal(
      EniWindowsContainerComponent,
      config.viewContainerRef,
      injector,
      config.componentFactoryResolver
    );
    const containerRef = this._overlayRef.attach(windowsContainerPortal);

    return containerRef;
  }

  protected _attachWindowContent<T, R>(
    windowContent: TemplateRef<T> | ComponentType<T> | string,
    windowsContainer: EniWindowsContainerComponent,
    windowConfig: EniWindowConfig
  ): EniWindowRef<T, R> {
    const windowRef = new EniWindowRef<T, R>(windowConfig.id);

    const injector = this._createInjector<any>(windowConfig, windowRef, windowContent);
    const windowFactory = this.componentFactoryResolver.resolveComponentFactory(EniWindowComponent);
    const windowComponentRef = windowsContainer.viewContainerRef.createComponent(windowFactory, null, injector);

    windowRef.windowComponentInstance = windowComponentRef as ComponentRef<EniWindowComponent<T, R>>;
    windowComponentRef.changeDetectorRef.detectChanges();

    return windowRef;
  }

  private _getOverlayConfig() {
    const state = new OverlayConfig({
      positionStrategy: this._overlay
        .position()
        .global()
        .bottom()
        .left(),
      scrollStrategy: this._overlay.scrollStrategies.noop()
    });

    return state;
  }

  private _createInjector<T>(
    config: EniWindowConfig,
    windowRef: EniWindowRef<T>,
    windowContent: TemplateRef<any> | ComponentType<any> | string
  ): PortalInjector {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;

    const injectionTokens = new WeakMap<any, any>([
      [ENI_WINDOW_CONTENT, windowContent],
      [ENI_WINDOW_CONFIG, config],
      [EniWindowRef, windowRef]
    ]);

    return new PortalInjector(userInjector || this._injector, injectionTokens);
  }

  private _removeWindow(id: string) {
    this._openWindows.delete(id);
  }
}
