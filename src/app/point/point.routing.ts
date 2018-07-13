import { Routes } from '@angular/router';

import { PointComponent } from './point.component';

export const PointRoutes: Routes = [{
    path: '',
    component: PointComponent,
    data: {
      heading: 'point',
    }
  }];
