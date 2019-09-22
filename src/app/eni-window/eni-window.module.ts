import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { EniWindowsContainerComponent } from './eni-windows-container/eni-windows-container';
import { EniWindowComponent } from './eni-window-component/eni-window.component';

@NgModule({
  declarations: [EniWindowsContainerComponent, EniWindowComponent],
  imports: [CommonModule, OverlayModule, PortalModule],
  entryComponents: [EniWindowsContainerComponent, EniWindowComponent]
})
export class EniWindowModule {}
