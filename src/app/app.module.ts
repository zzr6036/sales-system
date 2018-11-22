import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { enableProdMode } from '@angular/core';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'ng-sidebar';
import { AgmCoreModule } from '@agm/core';

import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { SharedModule } from './shared/shared.module';

import { Injectable } from '@angular/core';
import { Inject, Optional } from '@angular/core';
import { Headers, URLSearchParams } from '@angular/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { ResponseContentType } from '@angular/http';
import { HttpModule, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { global } from './global';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AsyncLocalStorageModule } from 'angular-async-local-storage';
import { AlertsModule } from 'angular-alert-module';
import { FormesComponent } from './formes/formes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TabModule } from 'angular-tabs-component';
import { ReplaySubject } from "rxjs/ReplaySubject";
import { ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';
import { PaginationService } from './services/index';
import { PromotionComponent } from './promotion/promotion.component';
// import { PointComponent } from './point/point.component';
import { FilterPipe } from './filter.pipe';
import * as moment from 'moment';
import { SpecialpromotionComponent } from './specialpromotion/specialpromotion.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { MenuComponent } from './menu/menu.component';
// import { CreateMenuComponent } from './menu/create-menu/create-menu.component';
// import { SpecialpromotionCodeComponent } from './specialpromotion/specialpromotion-code/specialpromotion-code.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    FilterPipe,
    // MenuComponent,
    // CreateMenuComponent,
    // DashboardsComponent,
    // SpecialpromotionComponent,
    // SpecialpromotionCodeComponent,
    // FilterPipe,
    // PromotionComponent,
    // PointComponent,
  ],
  imports: [
    BrowserModule,
    TabModule,
    ReactiveFormsModule,
    AsyncLocalStorageModule,
    BrowserAnimationsModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    AlertsModule.forRoot(),
    FormsModule,
    HttpClientModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    NgbModule.forRoot(),
    SidebarModule.forRoot(),
    AgmCoreModule.forRoot({apiKey: 'YOURAPIKEY'})
  ],
  providers: [HttpClientModule, PaginationService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // exports: [FilterPipe]
})
export class AppModule { }

