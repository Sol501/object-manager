import { createReducer, on } from '@ngrx/store';
import { AuthUser } from '../auth.models';
import { AuthActions } from './auth.actions';

export const authFeatureKey = 'auth';

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

export const initialAuthState: AuthState = {
  accessToken: null,
  user: null,
  status: 'idle',
  error: null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.loginSubmitted, () => ({
    ...initialAuthState,
    status: 'loading' as const,
  })),
  on(AuthActions.loginSucceeded, AuthActions.sessionRestored, (_, { session }) => ({
    ...initialAuthState,
    accessToken: session.accessToken,
    user: session.user,
    status: 'success' as const,
  })),
  on(AuthActions.loginFailed, (_, { error }) => ({
    ...initialAuthState,
    status: 'error' as const,
    error,
  })),
  on(AuthActions.logoutRequested, () => initialAuthState),
  on(AuthActions.sessionExpired, () => ({
    ...initialAuthState,
    status: 'error' as const,
    error: 'Your session has expired. Please login again.',
  })),
);
