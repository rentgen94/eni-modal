import { ViewContainerRef, ComponentFactoryResolver, InjectionToken } from '@angular/core';

export const ENI_WINDOW_DATA = new InjectionToken<any>('EniWindowData');
export const ENI_WINDOW_CONTENT = new InjectionToken<any>('EniWindowContent');
export const ENI_WINDOW_CONFIG = new InjectionToken<any>('EniWindowConfig');

export class EniWindowConfig<D = any> {
  id?: string;

  zIndex?: number;

  width?: string = '';

  height?: string = '';

  minWidth?: string | number = 170;

  minHeight?: string | number = 170;

  data?: D | null = null;

  viewContainerRef?: ViewContainerRef;

  componentFactoryResolver?: ComponentFactoryResolver;
}

export const enum EniWindowState {
  OPEN,
  MINIMUM,
  INTERMEDIATE,
  MAXIMUM,
  CLOSING,
  CLOSED
}

export interface EniWindowStateChange {
  oldState: EniWindowState;
  newState: EniWindowState;
}
