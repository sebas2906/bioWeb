import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HighchartsChartModule } from 'highcharts-angular';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { DefaultComponent } from './default/default.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { DigitalMarketingComponent } from './digital-marketing/digital-marketing.component';
import { HumanResourcesComponent } from './human-resources/human-resources.component';
import { UserDataComponent } from './user-data/user-data.component';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
     DefaultComponent, ECommerceComponent, AnalyticsComponent, DigitalMarketingComponent, HumanResourcesComponent, UserDataComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    PerfectScrollbarModule,
    HighchartsChartModule,
    NgChartsModule
  ]
})
export class DashboardModule { }
