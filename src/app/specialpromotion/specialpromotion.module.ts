import { NgModule, Component, OnInit, Injectable } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { Ng2DragDropModule } from 'ng2-drag-drop';
import { Observable } from 'rxjs/Observable';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SpecialpromotionRoutes } from './specialpromotion.routing';
import { SpecialpromotionComponent } from './specialpromotion.component';
import { SpecialpromotionCodeComponent } from './specialpromotion-code/specialpromotion-code.component';
import { SpecialpromotionService } from './specialpromotion.service';

@NgModule({
    imports: [CommonModule, RouterModule.forChild(SpecialpromotionRoutes), 
              FormsModule, ReactiveFormsModule, DragulaModule,
              Ng2DragDropModule.forRoot(),
              NgbModule.forRoot(),
              Ng2SearchPipeModule,
            ],
    declarations: [SpecialpromotionComponent, SpecialpromotionCodeComponent],
    // providers: [PromotionCodeService]
    providers: [SpecialpromotionService]
  })
  
  export class SpecialpromotionModule {
    
  }