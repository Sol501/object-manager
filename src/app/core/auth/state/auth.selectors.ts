import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState, authFeatureKey } from './auth.reducer';

const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);

export const selectAccessToken = createSelector(selectAuthState, (state) => state.accessToken);
export const selectAuthUser = createSelector(selectAuthState, (state) => state.user);
export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.status === 'loading',
);
export const selectAuthError = createSelector(selectAuthState, (state) => state.error);
export const selectIsAuthenticated = createSelector(selectAccessToken, (token) => !!token);
