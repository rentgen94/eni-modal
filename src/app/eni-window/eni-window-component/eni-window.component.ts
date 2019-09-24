/* tslint:disable: variable-name */
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Inject,
  Injector,
  ElementRef,
  HostBinding,
  ChangeDetectorRef
} from '@angular/core';
import { ComponentType, TemplatePortal, ComponentPortal, CdkPortalOutlet, PortalInjector } from '@angular/cdk/portal';
import { isString } from 'util';
import {
  ENI_WINDOW_CONTENT,
  ENI_WINDOW_DATA,
  EniWindowState,
  EniWindowConfig,
  ENI_WINDOW_CONFIG
} from '../eni-window.config';
import { EniWindowRef } from '../eni-window-ref';
import { maxZIndex, decreaseZIndex } from 'src/app/common/utils';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'eni-window',
  templateUrl: './eni-window.component.html',
  styleUrls: ['./eni-window.component.scss']
})
export class EniWindowComponent<T, D = any> implements OnInit {
  @HostBinding('class.eni-window') cssClass = true;

  @HostBinding('class.show') get isFullScreen() {
    return this._windowRef.state === EniWindowState.INTERMEDIATE;
  }

  @HostBinding('class.minimized') get isMinimized() {
    return this.isMinimum();
  }

  @HostBinding('class.maximized') get isMaximaized() {
    return this.isMaximum();
  }

  /** The portal outlet inside of this container into which the dialog content will be loaded. */
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  dragEventTarget: MouseEvent | TouchEvent;

  readonly _id: number;
  private portal: TemplatePortal<T> | ComponentPortal<T>;

  constructor(
    private _injector: Injector,
    private _windowHost: ElementRef,
    @Inject(ENI_WINDOW_CONTENT) public windowContent: TemplateRef<T> | ComponentType<T> | string,
    @Inject(ENI_WINDOW_CONFIG) public config: EniWindowConfig<D>,
    public _windowRef: EniWindowRef<T>
  ) {}

  ngOnInit() {
    this.attachSuitableView();
    this.center();
    this._windowRef.stateChange.subscribe(change => {
      if (change.oldState === EniWindowState.MINIMUM) {
        this.attachSuitableView();
      }
      if (change.newState === EniWindowState.MINIMUM) {
        this._portalOutlet.detach();
      }
    });
  }

  protected attachSuitableView() {
    if (this.portal) {
      if (this.portal instanceof TemplatePortal) {
        this._portalOutlet.attachTemplatePortal(this.portal);
      } else if (this.portal instanceof ComponentPortal) {
        this._portalOutlet.attachComponentPortal(this.portal);
      }
    } else {
      if (this.windowContent instanceof TemplateRef) {
        this.attachTemplate(this.windowContent);
      } else if (isString(this.windowContent)) {
        throw new Error('Loading component from string unsupported');
      } else {
        this.attachComponent(this.windowContent as ComponentType<T>);
      }
    }
  }

  protected attachTemplate(content: TemplateRef<T>) {
    if (this._portalOutlet.hasAttached()) {
      return;
    }
    const portalRef = new TemplatePortal<T>(content, null, {
      $implicit: this.config.data,
      windowRef: this._windowRef
    } as any);
    this.portal = portalRef;
    this._portalOutlet.attachTemplatePortal(portalRef);
  }

  protected attachComponent(content: ComponentType<T>) {
    if (this._portalOutlet.hasAttached()) {
      return;
    }
    const userInjector = this._createInjector(this.config, this._windowRef);
    const portalRef = new ComponentPortal<T>(content, null, userInjector);
    this.portal = portalRef;
    const contentRef = this._portalOutlet.attachComponentPortal(portalRef);
  }

  private _createInjector(config: EniWindowConfig, windowRef: EniWindowRef<T>): PortalInjector {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;

    const injectionTokens = new WeakMap<any, any>([[ENI_WINDOW_DATA, config.data], [EniWindowRef, windowRef]]);

    return new PortalInjector(userInjector || this._injector, injectionTokens);
  }

  center() {
    let elementWidth = this._windowHost.nativeElement.offsetWidth;
    let elementHeight = this._windowHost.nativeElement.offsetHeight;

    if (elementWidth === 0 && elementHeight === 0) {
      this._windowHost.nativeElement.style.visibility = 'hidden';
      // this.windowRoot.nativeElement.style.display = 'block';
      elementWidth = this._windowHost.nativeElement.offsetWidth;
      elementHeight = this._windowHost.nativeElement.offsetHeight;
      // this.windowRoot.nativeElement.style.display = 'none';
      this._windowHost.nativeElement.style.visibility = 'visible';
    }

    const x = Math.max((window.innerWidth - elementWidth) / 2, 0);
    const y = Math.max((window.innerHeight - elementHeight) / 2, 0);

    this._windowHost.nativeElement.style.left = x + 'px';
    this._windowHost.nativeElement.style.top = y + 'px';
  }

  getMaxModalIndex() {
    return maxZIndex('.cdk-overlay-container .eni-window');
  }

  moveOnTop() {
    if (this.isMinimum()) {
      return;
    }
    decreaseZIndex('.cdk-overlay-container .eni-window', 1000);
    const newZIndex = this.getMaxModalIndex() || 1000;
    this.config.zIndex = newZIndex + 1;
    this._windowHost.nativeElement.style.zIndex = this.config.zIndex;
  }

  initDrag(event: MouseEvent | TouchEvent) {
    if (this.isMinimum()) {
      return;
    }
    if (this._windowRef.state !== EniWindowState.MAXIMUM) {
      this.dragEventTarget = event;
    }
  }

  onClose(event: Event) {
    event.stopPropagation();
    this._windowRef.close();
  }

  onMaximize(event: Event) {
    event.stopPropagation();
    if (this.isMaximum()) {
      this._windowRef.setNewState(EniWindowState.INTERMEDIATE);
      return;
    }
    this._windowRef.maximize();
  }

  onMinimize(event: Event) {
    event.stopPropagation();
    if (this.isMinimum()) {
      this._windowRef.setNewState(EniWindowState.INTERMEDIATE);
      return;
    }
    this._windowRef.minimize();
  }

  isMaximum() {
    return this._windowRef.state === EniWindowState.MAXIMUM;
  }

  isMinimum() {
    return this._windowRef.state === EniWindowState.MINIMUM;
  }
}
