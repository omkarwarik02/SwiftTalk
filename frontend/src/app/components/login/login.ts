import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input';
import { inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { Router, RouterLink } from "@angular/router";
import { Auth } from '../../services/auth';
import { AuthState } from '../../store/auth-state';
import { NgIf } from "../../../../node_modules/@angular/common/types/_common_module-chunk";
import { SocketService } from '../../services/socket.service';
import { Message } from '../../services/message';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule, MatIconModule,
    RouterLink,
    MatProgressSpinnerModule
   
],
  
    
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

private fb = inject(FormBuilder);
private auth = inject(Auth)
private router = inject(Router)
private authState = inject(AuthState);
private socketService = inject(SocketService);
private msg = inject(Message);

loading = false
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submit() {
   if(this.loginForm.invalid) return;

   const {email,password} = this.loginForm.value;
   this.loading = true;

   this.auth.login(email!, password!).subscribe({
    next:(res:any)=> {
      this.msg.success('Login Successful');
      this.loading = false;
      const user = res.data?.login?.user;
      console.log('Login succss:', res)

      if(user){
        this.authState.setUser(user);
        this.socketService.connect();
        this.router.navigate(['/home']);
      }
      
    },
    error:(err)=>{
      this.loading = false;
      console.log('Login failed:',err)
    },
   })

   }
  }

