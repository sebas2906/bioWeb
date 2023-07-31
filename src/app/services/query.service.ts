import { Injectable } from '@angular/core';
import { Apollo, MutationResult, gql } from 'apollo-angular';
import { Subject, firstValueFrom, lastValueFrom } from 'rxjs';
import { AlertsService } from './alerts.service';
import { User } from '../models/Users.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  public update_user_data = new Subject();

  constructor(private apollo: Apollo, private alertService: AlertsService, private router:Router) { }

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

  async register(name: string, last_name: string, email: string, password: string, repeat: string) {
    let err_msg = '';
    this.alertService.setLoading();
    let query = this.apollo.mutate({
      mutation: gql`
      mutation CreateUser($name: String!, $lastName: String!, $password: String!, $repeat: String!, $email: String!) {
        createUser(name: $name, last_name: $lastName, password: $password, repeat: $repeat, email: $email) {
          name
          id
        }
      }
      `,
      variables: {
        name,
        lastName: last_name,
        email,
        password,
        repeat
      },

    });
    let resp = await firstValueFrom(query).catch(err => {
      this.alertService.stopLoading();
      this.alertService.setAlert('error', 'Ha ocurrido un error de registro', 'Error');
      console.error('Error de registro: ', err);
      err_msg = err;
      resp = undefined;
      localStorage.clear();
    });
    if (resp == undefined) throw new Error(err_msg);
    this.alertService.stopLoading();
    this.alertService.setAlert('success', 'Se ha registrado correctamente', 'Éxito');
    console.log(resp);
    localStorage.clear();

    // localStorage.setItem('session', (resp as MutationResult).data.login.value);
    return resp;
  }

  async getAccountInfo() {
    let err_msg = '';
    this.alertService.setLoading();
    let query = this.apollo.watchQuery({
      query: gql`{ 
        me {
        name
        last_name
        email
        patients {
          name
          last_name
          id
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

  async getUserInfo(user_id: string) {
    let err_msg = '';
    this.alertService.setLoading();
    let query = this.apollo.watchQuery({
      query: gql`
       query UserByID($id: String!) {
        userByID(id: $id) {
          name
          last_name
          email
          rol
          id
        }
      }`,
      variables: {
        id: user_id
      }
    }).valueChanges;
    let resp = await firstValueFrom(query).catch(err => {
      this.alertService.stopLoading();
      this.alertService.setAlert('error', 'Ha ocurrido un error al obtener información de este usuario', 'Error');
      console.error('Error obteniendo información de la cuenta: ', err);
      localStorage.clear();
      err_msg = err;
      resp = undefined;
    });
    if (resp == undefined) throw new Error(err_msg);
    this.alertService.stopLoading();
    //this.alertService.setAlert('success', 'Query test realizada exitosamente', 'Éxito');
    console.log(resp);
    return (resp as MutationResult).data.userByID as User;
  }

  async registerPatient(name:String, last_name:string, email:string, device_id:string) {
    let err_msg = '';
    this.alertService.setLoading();
    let query = this.apollo.mutate({
      mutation: gql`
      mutation AddPatient($name: String!, $lastName: String!, $email: String!, $device_id:String) {
        addPatient(name: $name, last_name: $lastName, email: $email, device_id:$device_id) {
          name
          last_name
          email
          password
          rol
          device_id
          id
        }
      }
      `,
      variables: {
        name,
        lastName: last_name,
        email,
        device_id
      }
    });
    let resp = await firstValueFrom(query).catch(err => {
      this.alertService.stopLoading();
      this.alertService.setAlert('error', 'Ha ocurrido un error al crear el paciente', 'Error');
      console.error('Error de registro de paciente: ', err);
      err_msg = err;
      resp = undefined;
      localStorage.clear();
    });
    if (resp == undefined) throw new Error(err_msg);
    this.alertService.stopLoading();
    this.alertService.setAlert('success', 'Se ha registrado al paciente correctamente', 'Éxito');
    console.log(resp);
    await this.apollo.client.resetStore();
    this.update_user_data.next('');
    // localStorage.setItem('session', (resp as MutationResult).data.login.value);
    return resp;
  }

  /**
   * Determina si un usuario se encuetra logueado
   */
  isLoggedIn() {
    if (!localStorage.getItem('session')) return false;
    return true;
  }

  onUpdateUserData(){
    return this.update_user_data;
  }

  closeSession(){
    let option = confirm('Está seguro que desea cerrar sesión?');
    if(option){
      localStorage.clear();
      this.router.navigate(['./auth/sign-in']);
    }
    
  }
}
