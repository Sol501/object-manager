import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from './auth.facade.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  return auth.isAuthenticated() || router.createUrlTree(['/login']);
};

export const loginGuard: CanActivateFn = () => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  return auth.isAuthenticated() ? router.createUrlTree(['/objects']) : true;
};
