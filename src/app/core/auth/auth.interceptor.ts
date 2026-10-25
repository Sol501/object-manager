import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { AuthActions } from './state/auth.actions';
import { selectAccessToken } from './state/auth.selectors';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const api = new URL(inject(API_BASE_URL));
  let url: URL;

  try {
    url = new URL(request.url);
  } catch {
    return next(request);
  }

  const apiPath = `${api.pathname}${api.pathname.endsWith('/')? '' : '/'}`;
  if (
    url.origin !== api.origin ||
    !url.pathname.startsWith(apiPath) ||
    url.pathname === `${apiPath}login.php`
  ) {
    return next(request);
  }

  const store = inject(Store);
  const accessToken = store.selectSignal(selectAccessToken);
  const token = accessToken();

  if (!token) {
    return next(request);
  }

  return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && accessToken() === token) {
        store.dispatch(AuthActions.sessionExpired());
      }

      return throwError(() => error);
    }),
  );
};
