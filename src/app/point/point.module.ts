import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PointComponent } from './point.component';
import { PointRoutes } from './point.routing';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(PointRoutes)],
  declarations: [PointComponent]
})

export class PointModule {}