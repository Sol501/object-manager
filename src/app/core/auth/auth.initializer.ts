import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthStorageService } from './auth.storage.service';
import { AuthActions } from './state/auth.actions';

export function initializeAuth(): void {
  const store = inject(Store);
  const session = inject(AuthStorageService).read();

  if (session) {
    store.dispatch(AuthActions.sessionRestored({ session }));
  }
}
