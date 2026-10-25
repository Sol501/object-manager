import { Routes } from '@angular/router';
import { ObjectsComponent } from './objects.component';

export const objectsRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ObjectsComponent,
    title: 'Objects',
  },
];
