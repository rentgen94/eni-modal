import {
  Directive,
  OnDestroy,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  NgZone,
  ElementRef,
  ViewContainerRef,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { getEvent, isLeftButton } from '../common/utils';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[eniDraggable]'
})
export class DraggableDirective implements OnInit, OnChanges, OnDestroy {
  @Input() dragEventTarget: MouseEvent | TouchEvent;
  @Input() dragX: boolean = true;
  @Input() dragY: boolean = true;
  @Input() useHost: boolean = false;

  @Output() dragStart: EventEmitter<any> = new EventEmitter();
  @Output() dragMove: EventEmitter<any> = new EventEmitter();
  @Output() dragEnd: EventEmitter<any> = new EventEmitter();

  isDragging: boolean;
  lastPageX: number;
  lastPageY: number;

  element: HTMLElement;

  private globalListeners = new Map<
    string,
    {
      handler: (event: Event) => void;
      options?: AddEventListenerOptions | boolean;
    }
  >();

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {}

  ngOnInit() {
    if (this.useHost) {
      this.element = (this.elementRef.nativeElement as HTMLElement).parentElement;
    } else {
      this.element = this.elementRef.nativeElement;
    }
  }

  ngOnChanges(cahnges: SimpleChanges) {
    if (cahnges.dragEventTarget && cahnges.dragEventTarget.currentValue) {
      this.onMouseDown(this.dragEventTarget);
    }
  }

  ngOnDestroy() {
    this.removeEventListener();
  }

  onMouseDown(event: MouseEvent | TouchEvent): void {
    if (!isLeftButton(event)) {
      return;
    }
    if (this.dragX || this.dragY) {
      const evt = getEvent(event);
      this.initDrag(evt.pageX, evt.pageY);
      this.addEventListeners(event);
      this.dragStart.emit(event);
    }
  }

  onMouseMove(event: MouseEvent | TouchEvent): void {
    const evt = getEvent(event);
    this.onDrag(evt.pageX, evt.pageY);
    this.dragMove.emit(event);
  }

  onMouseUp(event: MouseEvent | TouchEvent): void {
    this.endDrag();
    this.removeEventListener();
    this.dragEnd.emit(event);
  }

  addEventListeners(event: MouseEvent | TouchEvent) {
    const isTouchEvent = event.type.startsWith('touch');
    const moveEvent = isTouchEvent ? 'touchmove' : 'mousemove';
    const upEvent = isTouchEvent ? 'touchend' : 'mouseup';
    this.globalListeners
      .set(moveEvent, {
        handler: this.onMouseMove.bind(this),
        options: false
      })
      .set(upEvent, {
        handler: this.onMouseUp.bind(this),
        options: false
      });

    this.ngZone.runOutsideAngular(() => {
      this.globalListeners.forEach((config, name) => {
        window.document.addEventListener(name, config.handler, config.options);
      });
    });
  }

  removeEventListener() {
    this.globalListeners.forEach((config, name) => {
      window.document.removeEventListener(name, config.handler, config.options);
    });
  }

  initDrag(pageX: number, pageY: number) {
    this.isDragging = true;
    this.lastPageX = pageX;
    this.lastPageY = pageY;
    this.elementRef.nativeElement.classList.add('dragging');
  }

  onDrag(pageX: number, pageY: number) {
    if (this.isDragging) {
      const deltaX = pageX - this.lastPageX;
      const deltaY = pageY - this.lastPageY;
      const coords = this.element.getBoundingClientRect();

      this.element.style.left = coords.left + deltaX + 'px';
      this.element.style.top = coords.top + deltaY + 'px';

      this.lastPageX = pageX;
      this.lastPageY = pageY;
    }
  }

  endDrag() {
    this.isDragging = false;
    this.elementRef.nativeElement.classList.remove('dragging');
  }
}
