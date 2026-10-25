import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/auth/auth.guard';
import { LoginComponent } from './features/login/login.component';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
    title: 'Login',
  },
  {
    path: 'objects',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadChildren: () => import('./features/objects/objects.module').then((m) => m.ObjectsModule),
  },
  { path: '**', redirectTo: 'login' },
];
