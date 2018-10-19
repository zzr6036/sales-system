import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MenuComponent } from './menu.component';
import { CreateMenuComponent } from './create-menu/create-menu.component';

export const MenuRoutes: Routes = [{
    path: '',
    component: MenuComponent,
    data: {
      heading: 'Menu',
    }
  },{
    path: 'create-menu',
    component:CreateMenuComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(MenuRoutes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
