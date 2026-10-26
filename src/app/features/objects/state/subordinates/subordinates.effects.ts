import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, takeUntil } from 'rxjs';
import { AuthActions } from '../../../../core/auth/state/auth.actions';
import { SubordinatesDataService } from '../../../../core/subordinates/subordinates.data.service';
import { SubordinatesActions } from './subordinates.actions';

@Injectable()
export class SubordinatesEffects {
  private readonly _actions = inject(Actions);
  private readonly _data = inject(SubordinatesDataService);

  readonly load = createEffect(() =>
    this._actions.pipe(
      ofType(SubordinatesActions.loadRequested),
      exhaustMap(() =>
        this._data.getAll().pipe(
          map((items) => SubordinatesActions.loadSucceeded({ items })),
          catchError(() =>
            of(
              SubordinatesActions.loadFailed({
                error: 'Could not load subordinates. Please try again.',
              }),
            ),
          ),
          takeUntil(
            this._actions.pipe(ofType(AuthActions.logoutRequested, AuthActions.sessionExpired)),
          ),
        ),
      ),
    ),
  );
}
