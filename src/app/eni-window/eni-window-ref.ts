import { Subject, Observable } from 'rxjs';
import { EniWindowComponent } from './eni-window-component/eni-window.component';
import { ComponentRef } from '@angular/core';

let uniqueId = 0;

export class EniWindowRef<R = any> {
  /** The instance of component opened into the Window. */
  componentInstance: ComponentRef<EniWindowComponent>;

  /** Subject for notifying the user that the Window has finished closing. */
  private readonly _afterClosed = new Subject<R | undefined>();

  constructor(readonly id: string = `eni-window-${uniqueId++}`) {}

  /**
   * Gets an observable that is notified when the window is finished closing.
   */
  afterClosed(): Observable<R | undefined> {
    return this._afterClosed.asObservable();
  }
}
