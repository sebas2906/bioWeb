import { Component, OnInit } from '@angular/core';
import { QueryService } from '../services/query.service';
import { User } from '../models/Users.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public user: User;
  public newPatientForm: FormGroup;

  constructor(private queryService: QueryService, private fb: FormBuilder) {
    this.loadUserInfo();
    this.newPatientForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      device_id: ['']
    })
  }

  ngOnInit(): void {
  }

  async loadUserInfo() {
    this.user = await this.queryService.getAccountInfo();
    console.log(this.user);
    this.user={...this.user}
  }

  async saveNewPatient() {
    console.log(this.newPatientForm)
    const { email, name, last_name, device_id } = this.newPatientForm.value;
    await this.queryService.registerPatient(name,last_name,email,device_id).then(()=>{
      this.loadUserInfo();
    });
  }

}
