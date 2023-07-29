import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { AlertsService } from './alerts.service';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  constructor(private apollo: Apollo, private alertService: AlertsService) { }



  async test() {
    let err_msg = '';
    this.alertService.setLoading();
    let query = this.apollo.watchQuery({
      query: gql`{
        allPersons{
          name
        }
      }`
    }).valueChanges;
    let resp = await firstValueFrom(query).catch(err => {
      this.alertService.stopLoading();
      this.alertService.setAlert('error', 'Ha ocurrido un error al realizar el quey test', 'Error');
      console.error('Error query test: ', err);
      err_msg = err;
      resp = undefined;
    });
    if (resp == undefined) throw new Error(err_msg);
    this.alertService.stopLoading();
    this.alertService.setAlert('success', 'Query test realizada exitosamente', 'Éxito');
    console.log(resp);
    return resp;
  }

  async login(email: string, password: string) {
    let err_msg = '';
    this.alertService.setLoading();
    let query = this.apollo.mutate({
      mutation: gql`
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          value
        }
      }
      `,
      variables: {
        email,
        password
      }
    });
    let resp = await firstValueFrom(query).catch(err => {
      this.alertService.stopLoading();
      this.alertService.setAlert('error', 'Ha ocurrido un error de login', 'Error');
      console.error('Error de login: ', err);
      err_msg = err;
      resp = undefined;
    });
    if (resp == undefined) throw new Error(err_msg);
    this.alertService.stopLoading();
    this.alertService.setAlert('success', 'Ha iniciado sesión correctamente', 'Éxito');
    console.log(resp);
    return resp;
  }
}
