import { Routes } from '@angular/router';

import { DashboardsComponent } from './dashboards.component';
import { ViewSalesComponent } from './view-sales/view-sales.component';

// export const FormesRoutes: Routes = [{
//   path: '',
//   component: FormesComponent
// },
// {
//   path: 'savedraft',
//   component: SavedraftComponent
// },
// {
//   path: 'createuser',
//   component: CreateuserComponent
// },
// {
//   path: 'createuser-edit/:Id',
//   component: CreateuserEditComponent
// },
// {
//   path: 'createuser-view/:Id',
//   component: CreateuserViewComponent
// }];

export const DashboardsRoutes: Routes = [{
  path: '',
  component: DashboardsComponent
},
{
  path: 'view-sales',
  component: ViewSalesComponent
}
];
