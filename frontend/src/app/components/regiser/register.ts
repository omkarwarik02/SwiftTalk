import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input';
import { inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { RouterLink } from "@angular/router";
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { AuthState } from '../../store/auth-state';
import { Message } from '../../services/message';


@Component({
  selector: 'app-register',
  imports: [   ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule, MatIconModule,
    RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  
private fb = inject(FormBuilder);
private auth = inject(Auth)
private router =inject(Router);
private authState = inject(AuthState);
private msg = inject(Message);
  registerForm = this.fb.group({
    name:[''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

submit() {
  if (this.registerForm.invalid) return;

  const { name, email, password } = this.registerForm.value;

  this.auth.register(name!, email!, password!).subscribe({
  next: (res: any) => {
    const user = res.data?.registerUser?.user;

    if (user) {
      this.msg.success('Registered Successfully')
      this.authState.setUser(user);
      this.router.navigate(['/login']);
    }
  },
  error: (err) => {
    this.msg.error('Registration Failed');
    console.log('Registration failed:', err)
  }
});

}


}
