import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './services/auth';
import { AuthState } from './store/auth-state';
import { AsyncPipe } from '@angular/common';
import { Navbar } from "./components/navbar/navbar";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SocketService } from './services/socket.service'; // ✅ ADD

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AsyncPipe,
    Navbar,
    MatProgressSpinnerModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  authState = inject(AuthState);
  private auth = inject(Auth);
  private socketService = inject(SocketService); // ✅ ADD

  ngOnInit() {
    console.log("APP INIT — calling ME()");

    this.auth.me().subscribe({
      next: user => {
        console.log("ME NEXT →", user);

        if (user) {
          this.authState.setUser(user);

          // 🔥 THIS WAS MISSING
          this.socketService.connect();
        } else {
          this.authState.finishLoading();
        }
      },
      error: () => this.authState.finishLoading()
    });
  }
}
