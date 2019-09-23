/* tslint:disable: variable-name */
import { Component, OnInit, TemplateRef, ViewChild, Inject, Injector, ElementRef, HostBinding } from '@angular/core';
import { ComponentType, TemplatePortal, ComponentPortal, CdkPortalOutlet, Portal } from '@angular/cdk/portal';
import { isString } from 'util';
import { ENI_WINDOW_CONTENT, ENI_WINDOW_DATA, EniWindowState } from '../eni-window.config';
import { EniWindowRef } from '../eni-window-ref';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'eni-window',
  templateUrl: './eni-window.component.html',
  styleUrls: ['./eni-window.component.scss']
})
export class EniWindowComponent<T, D = any> implements OnInit {
  @HostBinding('class.show') get isFullScreen() {
    return this._windowRef.state === EniWindowState.INTERMEDIATE;
  }

  @HostBinding('class.minimized') get isMinimized() {
    return this._windowRef.state === EniWindowState.MINIMUM;
  }

  @HostBinding('class.maximized') get isMaximaized() {
    return this._windowRef.state === EniWindowState.MAXIMUM;
  }

  /** The portal outlet inside of this container into which the dialog content will be loaded. */
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  readonly _id: number;
  private portal: TemplatePortal<T> | ComponentType<T>;

  constructor(
    private _injector: Injector,
    private _windowRoot: ElementRef,
    @Inject(ENI_WINDOW_CONTENT) public windowContent: TemplateRef<T> | ComponentType<T> | string,
    @Inject(ENI_WINDOW_DATA) public data: D,
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
    const portalRef = new TemplatePortal<T>(content, null, { $implicit: this.data, windowRef: this._windowRef } as any);
    this._portalOutlet.attachTemplatePortal(portalRef);
  }

  protected attachComponent(content: ComponentType<T>) {
    if (this._portalOutlet.hasAttached()) {
      return;
    }
    const portalRef = new ComponentPortal<T>(content, null, this._injector);
    const contentRef = this._portalOutlet.attachComponentPortal(portalRef);
  }

  center() {
    let elementWidth = this._windowRoot.nativeElement.offsetWidth;
    let elementHeight = this._windowRoot.nativeElement.offsetHeight;

    if (elementWidth === 0 && elementHeight === 0) {
      this._windowRoot.nativeElement.style.visibility = 'hidden';
      // this.windowRoot.nativeElement.style.display = 'block';
      elementWidth = this._windowRoot.nativeElement.offsetWidth;
      elementHeight = this._windowRoot.nativeElement.offsetHeight;
      // this.windowRoot.nativeElement.style.display = 'none';
      this._windowRoot.nativeElement.style.visibility = 'visible';
    }

    const x = Math.max((window.innerWidth - elementWidth) / 2, 0);
    const y = Math.max((window.innerHeight - elementHeight) / 2, 0);

    this._windowRoot.nativeElement.style.left = x + 'px';
    this._windowRoot.nativeElement.style.top = y + 'px';
  }

  onClose() {
    this._windowRef.close();
  }

  onMaximize() {
    this._windowRef.maximize();
  }

  onMinimize() {
    this._windowRef.minimize();
  }
}
