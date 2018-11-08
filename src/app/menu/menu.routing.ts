import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MenuComponent } from './menu.component';
import { CreateMenuComponent } from './create-menu/create-menu.component';
import { EditMenuComponent } from './edit-menu/edit-menu.component';

export const MenuRoutes: Routes = [{
    path: '',
    component: MenuComponent,
    data: {
      heading: 'Menu',
    }
  },{
    path: 'create-menu',
    component:CreateMenuComponent,
  },{
    path: 'edit-menu/:Id',
    component: EditMenuComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(MenuRoutes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
