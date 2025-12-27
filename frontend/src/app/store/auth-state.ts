import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';  // adjust path

@Injectable({
  providedIn: 'root',
})
export class AuthState {

  private userSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(true);

  user$ = this.userSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  setUser(user: User | null) {
    console.log("%cAuthState → setUser()", "color: lightgreen;", user);
    this.userSubject.next(user);
    this.loadingSubject.next(false);
  }

  finishLoading() {
    console.log("%cAuthState → finishLoading()", "color: orange;");
    this.loadingSubject.next(false);
  }

  clearUser() {
    this.userSubject.next(null);
  }

  get user() {
    return this.userSubject.value;   // typed as User | null
  }
}
