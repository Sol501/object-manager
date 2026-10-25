import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuthCredentials, AuthSession } from '../auth.models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login submitted': props<{ credentials: AuthCredentials }>(),
    'Login succeeded': props<{ session: AuthSession }>(),
    'Session restored': props<{ session: AuthSession }>(),
    'Login failed': props<{ error: string }>(),
    'Logout requested': emptyProps(),
    'Session expired': emptyProps(),
  },
});
