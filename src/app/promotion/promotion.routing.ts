import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PromotionComponent } from './promotion.component';
import { PromotionCodeComponent } from './promotion-code/promotion-code.component';
import { PromotionEditComponent } from './promotion-edit/promotion-edit.component';
import { PromotionUserlistComponent } from './promotion-userlist/promotion-userlist.component';
import { AssignPromotionComponent } from './assign-promotion/assign-promotion.component';
import { AssignPromotionUsersComponent } from './assign-promotion-users/assign-promotion-users.component'
import { AssignPromotionTimesComponent } from './assign-promotion-times/assign-promotion-times.component'

export const PromotionRoutes: Routes = [{
    path: '',
    component: PromotionComponent,
    data: {
      heading: 'Promotion',
    }
  },{
    path: 'promotion-code',
    component:PromotionCodeComponent,
  },{
    path: 'promotion-edit/:Id',
    component: PromotionEditComponent,
  },{
    path: 'promotion-userlist/:Id',
    component: PromotionUserlistComponent,
  },{
    path: 'assign-promotion/:Id',
    component: AssignPromotionComponent,
  },{
    path: 'assign-promotion-users/:Id',
    component: AssignPromotionUsersComponent,
  },{
    path: 'assign-promotion-times/:Id',
    component: AssignPromotionTimesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(PromotionRoutes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
