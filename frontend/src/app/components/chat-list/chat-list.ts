import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common'; // ✅ ADD THIS
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { AuthState } from '../../store/auth-state';
import { SocketService } from '../../services/socket.service';
import { User } from '../../models/user';

const USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      createdAt
    }
  }
`;

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    CommonModule, // 🔥 REQUIRED FOR *ngFor / *ngIf
    MatCardModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatList implements OnInit, OnDestroy {
  users: User[] = [];
  onlineUsers = new Set<string>();
  loading = true;

  private usersSub?: Subscription;
  private authSub?: Subscription;
  private initialized = false;

  private apollo = inject(Apollo);
  private router = inject(Router);
  private authState = inject(AuthState);
  private socketService = inject(SocketService);
  private cd = inject(ChangeDetectorRef);

ngOnInit() {

  console.log('🔥 ChatList component CREATED');

  this.loadUsers(); // ✅ ALWAYS LOAD USERS

  this.authSub = this.authState.user$.subscribe((user) => {
    if (user && !this.initialized) {
      this.initialized = true;

      this.socketService.onOnlineUsers((list) => {
        this.onlineUsers = new Set(list);
        this.cd.markForCheck();
      });
    }
  });
}


  private initOnce() {
    this.initialized = true;

    this.loadUsers();

    this.socketService.onOnlineUsers((list) => {
      this.onlineUsers = new Set(list);
      this.cd.markForCheck();
    });
  }

 loadUsers() {
  this.loading = true;

  this.usersSub?.unsubscribe();

 this.usersSub = this.apollo
  .watchQuery({
    query: USERS_QUERY,
    fetchPolicy: 'network-only',
    errorPolicy: 'all', // 🔥 THIS IS THE KEY
  })
  .valueChanges.subscribe((res: any) => {

  this.users = (res.data?.users ?? []).filter(
  (u: User) => u.id !== this.authState.user?.id
);

    this.loading = false;
    this.cd.markForCheck();
  });


}


  openChat(userId: string) {
    this.router.navigate(['/chat', userId]);
  }

  ngOnDestroy() {
    this.usersSub?.unsubscribe();
    this.authSub?.unsubscribe();
  }

  trackById(_: number, user: any) {
    return user.id;
  }
}
