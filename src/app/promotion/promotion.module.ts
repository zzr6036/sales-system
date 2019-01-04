import { NgModule, Component, OnInit, Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { Ng2DragDropModule } from 'ng2-drag-drop';
import { Observable } from 'rxjs/Observable';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { PromotionComponent } from './promotion.component';
import { PromotionRoutes } from './promotion.routing';
import { PromotionCodeComponent } from './promotion-code/promotion-code.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { PromotionCodeService } from './promotion-code/promotion-code.service';
import { PromotionService } from './promotion.service';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { PromotionEditComponent } from './promotion-edit/promotion-edit.component';
import { MomentModule } from 'angular2-moment';
import { OrderModule } from 'ngx-order-pipe';
import { PromotionUserlistComponent } from './promotion-userlist/promotion-userlist.component';
import { AssignPromotionComponent } from './assign-promotion/assign-promotion.component';
import { AssignPromotionUsersComponent } from './assign-promotion-users/assign-promotion-users.component';
import { AssignPromotionTimesComponent } from './assign-promotion-times/assign-promotion-times.component';
import { ActivePromocodeComponent } from './active-promocode/active-promocode.component';
import { ExpiryPromocodeComponent } from './expiry-promocode/expiry-promocode.component';
// import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(PromotionRoutes), 
            FormsModule, ReactiveFormsModule, DragulaModule,
            Ng2DragDropModule.forRoot(),
            NgbModule.forRoot(),
            Ng2SearchPipeModule,
            AngularDateTimePickerModule,
            MomentModule,
            OrderModule,],
  declarations: [PromotionComponent, PromotionCodeComponent, PromotionEditComponent, PromotionUserlistComponent, AssignPromotionComponent, AssignPromotionUsersComponent, AssignPromotionTimesComponent, ActivePromocodeComponent, ExpiryPromocodeComponent],
  // providers: [PromotionCodeService]
  providers: [PromotionService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class PromotionModule {
  
}