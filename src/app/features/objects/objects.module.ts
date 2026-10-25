import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { objectsRoutes } from './objects.routes';

@NgModule({
  imports: [RouterModule.forChild(objectsRoutes)],
})
export class ObjectsModule {}
