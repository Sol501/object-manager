import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthCredentials } from './auth.models';
import { AuthActions } from './state/auth.actions';
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthUser,
  selectIsAuthenticated,
} from './state/auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly store = inject(Store);

  readonly user = this.store.selectSignal(selectAuthUser);
  readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  readonly isLoading = this.store.selectSignal(selectAuthLoading);
  readonly error = this.store.selectSignal(selectAuthError);

  login(credentials: AuthCredentials): void {
    this.store.dispatch(AuthActions.loginSubmitted({ credentials }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logoutRequested());
  }
}
