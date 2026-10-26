import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from '../../../../core/auth/state/auth.actions';
import { Subordinate } from '../../../../core/subordinates/subordinate.models';
import { SubordinatesActions } from './subordinates.actions';

export interface SubordinatesState {
  items: Subordinate[];
  status: 'idle' | 'loading' | 'loaded' | 'error';
  error: string | null;
}

export const initialSubordinatesState: SubordinatesState = {
  items: [],
  status: 'idle',
  error: null,
};

export const subordinatesFeature = createFeature({
  name: 'subordinates',
  reducer: createReducer(
    initialSubordinatesState,
    on(SubordinatesActions.loadRequested, (state): SubordinatesState => ({
      ...state,
      status: 'loading',
      error: null,
    })),
    on(SubordinatesActions.loadSucceeded, (state, { items }): SubordinatesState => ({
      ...state,
      items,
      status: 'loaded',
      error: null,
    })),
    on(SubordinatesActions.loadFailed, (state, { error }): SubordinatesState => ({
      ...state,
      status: 'error',
      error,
    })),
    on(AuthActions.logoutRequested, AuthActions.sessionExpired, () => initialSubordinatesState),
  ),
});
