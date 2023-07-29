import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';



export interface Alert {
  type: 'error' | 'success' | 'info',
  message: string,
  title: string,
  id: number
}

@Injectable({
  providedIn: 'root'
})



export class AlertsService {


  loading = false;
  en_alerts = false;
  alert_list = [];

  new_alert_subject: Subject<void> = new Subject();
  set_loading_subject: Subject<boolean> = new Subject();

  constructor() { }


  /**
   * Sets a new alert with 5 seconds of timeout
   * @param type 
   * @param message 
   * @param title 
   */
  setAlert(type: 'error' | 'success' | 'info', message: string, title: string) {
    this.en_alerts = true;
    let id = (new Date()).getTime();
    this.alert_list.push({
      type,
      message,
      title,
      id
    });
    this.new_alert_subject.next();
    setTimeout(() => {
      let index = this.alert_list.findIndex(e => e.id == id);
      this.alert_list.splice(index, 1);
      this.new_alert_subject.next();
    }, 7000);
  }

 
  setLoading() {
    this.loading = true;
    this.set_loading_subject.next(true);
  }

  stopLoading() {
    this.loading = false;
    this.set_loading_subject.next(false);
  }

  /**
   * Observable for new alerts emited
   * @returns new alert observable
   */
  onNewAlert() {
    return this.new_alert_subject;
  }

  onLoandingChange(){
    return this.set_loading_subject;
  }

}
