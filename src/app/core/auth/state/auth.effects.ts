import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { AuthDataService } from '../auth.data.service';
import { AuthStorageService } from '../auth.storage.service';
import { AuthActions } from './auth.actions';

function loginErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'Unable to reach the server. Check your connection then try again.';
    }
    if (error.status === 401 || error.status === 403) {
      return 'Email or password is incorrect.';
    }
    if (error.status === 429) {
      return 'Too many attempts. Please wait a moment then try again.';
    }
    return 'Login is unavailable right now. Please try again later.';
  }

  return error instanceof Error ? error.message : 'Unable to login. Please try again.';
}

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authData = inject(AuthDataService);
  private readonly authStorage = inject(AuthStorageService);
  private readonly router = inject(Router);

  readonly login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSubmitted),
      exhaustMap(({ credentials }) =>
        this.authData.login(credentials).pipe(
          map((session) => AuthActions.loginSucceeded({ session })),
          catchError((error: unknown) =>
            of(AuthActions.loginFailed({ error: loginErrorMessage(error) })),
          ),
        ),
      ),
    ),
  );

  readonly loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSucceeded),
        tap(({ session }) => {
          this.authStorage.save(session);
          void this.router.navigateByUrl('/objects');
        }),
      ),
    { dispatch: false },
  );

  readonly logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutRequested, AuthActions.sessionExpired),
        tap(() => {
          this.authStorage.clear();
          void this.router.navigateByUrl('/login');
        }),
      ),
    { dispatch: false },
  );
}
