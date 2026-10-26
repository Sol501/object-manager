import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { subordinatesFeature } from './state/subordinates/subordinates.reducer';
import { SubordinatesEffects } from './state/subordinates/subordinates.effects';
import { objectsRoutes } from './objects.routes';

@NgModule({
  imports: [
    RouterModule.forChild(objectsRoutes),
    StoreModule.forFeature(subordinatesFeature),
    EffectsModule.forFeature([SubordinatesEffects]),
  ],
})
export class ObjectsModule {}
