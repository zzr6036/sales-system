import { NgModule, Component, OnInit, Injectable } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgModel, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { Observable } from 'rxjs/Observable';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuComponent } from './menu.component';
import { MenuRoutes } from './menu.routing'
import { CreateMenuComponent } from './create-menu/create-menu.component';
import { EditMenuComponent } from './edit-menu/edit-menu.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(MenuRoutes), 
            FormsModule, ReactiveFormsModule,
            AngularMultiSelectModule],
  declarations: [MenuComponent, CreateMenuComponent, EditMenuComponent],
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: MenuModule, multi: true}]
  // providers: [PromotionCodeService]
//   providers: [PromotionService]
})

export class MenuModule {
  
}