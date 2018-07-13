import { Routes } from '@angular/router';

import { FormesComponent } from './formes.component';
import { CreateuserComponent } from './createuser/createuser.component';
import { SavedraftComponent } from './savedraft/savedraft.component';
import { CreateuserEditComponent } from './createuser-edit/createuser-edit.component';
import { CreateuserViewComponent } from './createuser-view/createuser-view.component';

// export const FormesRoutes: Routes = [{
//   path: '',
//   component: FormesComponent,
//   data: {
//     heading: 'Formes'
//   }
// }];

// export const FormesRoutes: Routes = [{
//   path: '',
//   children: [{
//     path: 'createuser',
//     component: CreateuserComponent
//   }, {
//     path: 'savedraft',
//     component: SavedraftComponent
//   }]
//   }];

export const FormesRoutes: Routes = [{
  path: '',
  component: FormesComponent
},
{
  path: 'savedraft',
  component: SavedraftComponent
},
{
  path: 'createuser',
  component: CreateuserComponent
},
{
  path: 'createuser-edit/:Id',
  component: CreateuserEditComponent
},
{
  path: 'createuser-view/:Id',
  component: CreateuserViewComponent
}];
