import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthState } from '../store/auth-state';
import { combineLatest, map, filter } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authState = inject(AuthState);
  const router = inject(Router);

  return combineLatest([authState.user$, authState.loading$]).pipe(
    filter(([_, loading]) => loading === false),   // WAIT UNTIL LOADING FINISHES
    map(([user]) => {
      console.log("GUARD DECISION → user:", user);
      
      if (user) {
        return true; // allow access
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
