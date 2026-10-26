import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Subordinate } from '../../../../core/subordinates/subordinate.models';

export const SubordinatesActions = createActionGroup({
  source: 'Subordinates',
  events: {
    'Load requested': emptyProps(),
    'Load succeeded': props<{ items: Subordinate[] }>(),
    'Load failed': props<{ error: string }>(),
  },
});
