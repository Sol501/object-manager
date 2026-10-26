import { Routes } from '@angular/router';
import { ObjectsComponent } from './objects.component';

export const objectsRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ObjectsComponent,
    title: 'Objects',
  },
  {
    path: 'types',
    loadComponent: () =>
      import('./add-object-type/add-object-type.component').then((module) => module.AddObjectTypeComponent),
    title: 'Add Object Type',
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./add-object/add-object.component').then((module) => module.AddObjectComponent),
    title: 'Add Object',
  },
];
