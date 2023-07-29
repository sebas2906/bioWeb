import { Component } from '@angular/core';
import { Alert, AlertsService } from './services/alerts.service';
import { QueryService } from './services/query.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public alerts: Alert[] = [];
  public is_loading = false;

  constructor(private alertService: AlertsService, private queryService:QueryService) {
    //alerts
    this.alertService.onNewAlert().subscribe(() => {
      this.alerts = JSON.parse(JSON.stringify(this.alertService.alert_list));
    });
    //loading
    this.alertService.onLoandingChange().subscribe((state) => {
      this.is_loading = state;
      console.log('loading: ',state)
    });
    //test alerts
    /* setInterval(() => {
      this.alertService.setAlert('info', 'Mensaje','titulo');
    }, 1000); */
   /*    setTimeout(() => {
    this.queryService.test();
    }, 5000); */
  }
}
