import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbProgressbarModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { FormesComponent } from './formes.component';
import { FormesRoutes } from './formes.routing';
import { CreateuserComponent } from './createuser/createuser.component';
import { SavedraftComponent } from './savedraft/savedraft.component';
import { TabModule } from 'angular-tabs-component';
import { angularCheckboxes } from 'angular-checkboxes';
// import { CheckBoxList } from 'ng2-checkboxlist/checkboxlist.js';
import { MatSelectModule } from '@angular/material/select';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import { NgHighlightModule } from 'ngx-text-highlight';
import { CreateuserService } from './shared/createuser.service';
import { AlertsModule } from 'angular-alert-module';
import { MomentModule } from 'angular2-moment';
import { FilterPipe } from './../filter.pipe';
import { SearchPipe } from './../search.pipe';
import { CreateuserEditComponent } from './createuser-edit/createuser-edit.component';
import { CreateuserViewComponent } from './createuser-view/createuser-view.component';
import { ExcelService } from '../services/excel.service';

@NgModule({
  imports: [CommonModule, 
            MomentModule,
            TabModule, 
            FormsModule, 
            RouterModule.forChild(FormesRoutes), 
            NgbProgressbarModule, 
            NgbTabsetModule,
            AngularMultiSelectModule, 
            Ng2SearchPipeModule,
            Ng2FilterPipeModule,
            NgHighlightModule,
            AlertsModule.forRoot()],
  declarations: [FormesComponent, CreateuserComponent, SavedraftComponent, CreateuserEditComponent, CreateuserViewComponent, SearchPipe],
  // exports: [FilterPipe]
  exports: [SearchPipe],
  providers: [ExcelService]
})

export class FormesModule {}
