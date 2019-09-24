/* tslint:disable: variable-name */
import { Subject, Observable, ReplaySubject } from 'rxjs';
import { EniWindowComponent } from './eni-window-component/eni-window.component';
import { ComponentRef } from '@angular/core';
import { EniWindowState, EniWindowStateChange } from './eni-window.config';
import { Portal } from '@angular/cdk/portal';

let uniqueId = 0;

export class EniWindowRef<T, R = any> {
  /** The window container for template or custom component */
  windowComponentInstance: ComponentRef<EniWindowComponent<T, R>>;

  protected _prevState: EniWindowState;
  protected _state = EniWindowState.INTERMEDIATE;
  protected _stateChange$ = new ReplaySubject<EniWindowStateChange>(1);

  private _result: R | undefined;

  /** Subject for notifying the user that the Window has finished closing. */
  private readonly _afterClosed = new Subject<R | undefined>();

  constructor(readonly id: string = `eni-window-${uniqueId++}`) {}

  /**
   * Close the window.
   * @param windowResult Optional result to return to the dialog opener.
   */
  close(windowResult?: R): void {
    if (this._state === EniWindowState.CLOSED) {
      return;
    }

    this._result = windowResult;
    this._state = EniWindowState.CLOSING;
    this.windowComponentInstance.destroy();
    this._state = EniWindowState.CLOSED;
    this._afterClosed.next(this._result);
    this._afterClosed.complete();
  }

  /**
   * Gets an observable that is notified when the window is finished closing.
   */
  afterClosed(): Observable<R | undefined> {
    return this._afterClosed.asObservable();
  }

  setNewState(newState: EniWindowState) {
    if (newState && this.state !== newState) {
      this._prevState = this.state;
      this._state = newState;
      this._stateChange$.next({ oldState: this._prevState, newState });
    }
  }

  get state(): EniWindowState {
    return this._state;
  }

  get stateChange(): Observable<EniWindowStateChange> {
    return this._stateChange$.asObservable();
  }

  minimize() {
    this.setNewState(EniWindowState.MINIMUM);
  }

  maximize() {
    this.setNewState(EniWindowState.MAXIMUM);
  }

  show() {
    this.setNewState(EniWindowState.INTERMEDIATE);
  }

  toPreviousState() {
    this.setNewState(this._prevState);
  }
}
