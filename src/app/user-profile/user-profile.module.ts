import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UserProfileComponent } from './user-profile.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    NgbModule,
    ReactiveFormsModule
  ]
})
export class UserProfileModule { }
