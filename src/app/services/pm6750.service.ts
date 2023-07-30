import { Injectable } from '@angular/core';
import { AlertsService } from './alerts.service';

@Injectable({
  providedIn: 'root'
})
export class Pm6750Service {

  public worker: Worker;

  constructor(private alertService: AlertsService) {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./user-data.worker', import.meta.url));
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
      this.alertService.setAlert('error', 'Su navegador no es compatible. Por favor use un navegador Chromium', 'Error de inicialización');
    }
  }

  workerAvailable(): boolean {
    return typeof Worker != undefined;
  }

}
