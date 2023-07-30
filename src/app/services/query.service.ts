import { Injectable } from '@angular/core';
import { Apollo, MutationResult, gql } from 'apollo-angular';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { AlertsService } from './alerts.service';
import { User } from '../models/Users.model';

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
      },

    });
    let resp = await firstValueFrom(query).catch(err => {
      this.alertService.stopLoading();
      this.alertService.setAlert('error', 'Ha ocurrido un error de login', 'Error');
      console.error('Error de login: ', err);
      err_msg = err;
      resp = undefined;
      localStorage.clear();
    });
    if (resp == undefined) throw new Error(err_msg);
    this.alertService.stopLoading();
    this.alertService.setAlert('success', 'Ha iniciado sesión correctamente', 'Éxito');
    console.log(resp);
    localStorage.clear();
    localStorage.setItem('session', (resp as MutationResult).data.login.value);
    return resp;
  }

  async getAccountInfo() {
    let err_msg = '';
    this.alertService.setLoading();
    let query = this.apollo.watchQuery({
      query: gql`{ 
        me {
        username
        email
        password
        patients {
          username
        }
        id
      }
    }`
    }).valueChanges;
    let resp = await firstValueFrom(query).catch(err => {
      this.alertService.stopLoading();
      this.alertService.setAlert('error', 'Ha ocurrido un error al obtener información de la cuenta', 'Error');
      console.error('Error obteniendo información de la cuenta: ', err);
      localStorage.clear();
      err_msg = err;
      resp = undefined;
    });
    if (resp == undefined) throw new Error(err_msg);
    this.alertService.stopLoading();
    //this.alertService.setAlert('success', 'Query test realizada exitosamente', 'Éxito');
    console.log(resp);
    return (resp as MutationResult).data.me as User;
  }

  /**
   * Determina si un usuario se encuetra logueado
   */
  isLoggedIn() {
    if (!localStorage.getItem('session')) return false;
    return true;
  }
}
