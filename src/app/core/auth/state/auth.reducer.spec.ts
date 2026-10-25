import { AuthActions } from './auth.actions';
import { authReducer, initialAuthState } from './auth.reducer';

describe('authReducer', () => {
  const session = {
    accessToken: 'test-token',
    user: { id: '12', email: 'user@example.test' },
  };

  it('reset error on login', () => {
    const failed = authReducer(
      initialAuthState,
      AuthActions.loginFailed({ error: 'Incorrect login' }),
    );
    const loading = authReducer(
      failed,
      AuthActions.loginSubmitted({
        credentials: { email: 'user@example.test', password: 'test-password' },
      }),
    );

    expect(loading).toEqual({ ...initialAuthState, status: 'loading' });
    expect(failed.error).toBe('Incorrect login');
  });

  it('login success', () => {
    const state = authReducer(initialAuthState, AuthActions.loginSucceeded({ session }));
    expect(state).toEqual({ ...initialAuthState, ...session, status: 'success' });
  });

  it('restore session', () => {
    const state = authReducer(initialAuthState, AuthActions.sessionRestored({ session }));
    expect(state).toEqual({ ...initialAuthState, ...session, status: 'success' });
  });

  it('failed login', () => {
    const authenticated = authReducer(initialAuthState, AuthActions.loginSucceeded({ session }));
    const state = authReducer(authenticated, AuthActions.loginFailed({ error: 'Incorrect login' }));
    expect(state).toEqual({ ...initialAuthState, status: 'error', error: 'Incorrect login' });
  });

  it('logout', () => {
    const authenticated = authReducer(initialAuthState, AuthActions.loginSucceeded({ session }));
    expect(authReducer(authenticated, AuthActions.logoutRequested())).toEqual(initialAuthState);
  });

  it('expired sesion', () => {
    const authenticated = authReducer(initialAuthState, AuthActions.loginSucceeded({ session }));
    const state = authReducer(authenticated, AuthActions.sessionExpired());

    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.status).toBe('error');
    expect(state.error).toBe('Your session has expired. Please login again.');
  });
});
