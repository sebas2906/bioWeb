import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AlertsService } from 'src/app/services/alerts.service';
import { QueryService } from 'src/app/services/query.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private alertService:AlertsService, private queryService:QueryService) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeat: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  // On Signup link click
  onSignIn() {
    this.router.navigate(['sign-in'], { relativeTo: this.route.parent });
  }

  ngOnInit(): void {
  }

  register(){
    console.log(this.registerForm);
    const {name,lastname, email, password, repeat} = this.registerForm.value;
    if(password!=repeat) this.alertService.setAlert('error',"Las contraseñas con coinciden","Error");
    this.queryService.register(name,lastname,email,password,repeat).then(()=>{
      console.log('Redirigiendo a login');
      this.router.navigate(['sign-in'], { relativeTo: this.route.parent });
    });
  }

}
