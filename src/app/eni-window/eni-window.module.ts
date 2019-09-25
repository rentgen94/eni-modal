import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { EniWindowsContainerComponent } from './eni-windows-container/eni-windows-container';
import { EniWindowComponent } from './eni-window-component/eni-window.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DraggableModule } from '../draggable';
import { ResizableModule } from '../resizable/resizable.module';

@NgModule({
  declarations: [EniWindowsContainerComponent, EniWindowComponent],
  imports: [CommonModule, OverlayModule, PortalModule, DragDropModule, DraggableModule, ResizableModule],
  entryComponents: [EniWindowsContainerComponent, EniWindowComponent]
})
export class EniWindowModule {}
