import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubordinatesActions } from '../../../../../../../../../state/subordinates/subordinates.actions';
import {
 selectSubordinates,
  selectSubordinatesError,
  selectSubordinatesStatus,
} from '../../../../../../../../../state/subordinates/subordinates.selectors';

@Injectable()
export class SubordinatesFacade {
  private readonly _store = inject(Store);
  readonly items = this._store.selectSignal(selectSubordinates);
  readonly status = this._store.selectSignal(selectSubordinatesStatus);
  readonly error = this._store.selectSignal(selectSubordinatesError);

  ensureLoaded(): void {
    if (this.status() === 'idle') {
      this.load();
    }
  }

  load(): void {
    if (this.status() !== 'loading') {
      this._store.dispatch(SubordinatesActions.loadRequested());
	  }
   }
}
