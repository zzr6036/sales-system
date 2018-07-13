import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbProgressbarModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { TabModule } from 'angular-tabs-component';
import { angularCheckboxes } from 'angular-checkboxes';
// import { CheckBoxList } from 'ng2-checkboxlist/checkboxlist.js';
import { MatSelectModule } from '@angular/material/select';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AlertsModule } from 'angular-alert-module';
import { MomentModule } from 'angular2-moment';
import { FilterPipe } from './../filter.pipe';

import { DashboardsComponent } from './dashboards.component';
import { DashboardsRoutes } from './dashboards.routing';
import { ViewSalesComponent } from './view-sales/view-sales.component';
import { DashboardsService } from './dashboards.service';


@NgModule({
  imports: [CommonModule, 
            MomentModule,
            TabModule, 
            FormsModule, 
            RouterModule.forChild(DashboardsRoutes), 
            NgbProgressbarModule, 
            NgbTabsetModule,
            AngularMultiSelectModule, 
            Ng2SearchPipeModule,
            AlertsModule.forRoot()],
  declarations: [DashboardsComponent, ViewSalesComponent],
  // exports: [FilterPipe]
  providers: [DashboardsService]
})

export class DashboardsModule {}
