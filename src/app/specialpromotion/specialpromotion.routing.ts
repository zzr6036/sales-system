import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SpecialpromotionComponent } from './specialpromotion.component';
import { SpecialpromotionCodeComponent } from './specialpromotion-code/specialpromotion-code.component';

export const SpecialpromotionRoutes: Routes = [{
    path: '',
    component: SpecialpromotionComponent,
    data: {
        heading: 'Specialpromotion',
    }
},{
    path: 'specialpromotion-code',
    component: SpecialpromotionCodeComponent
}
];

@NgModule({
    imports: [RouterModule.forRoot(SpecialpromotionRoutes)],
    exports: [RouterModule]
})
export class SpecialpromotionRoutingModule { }