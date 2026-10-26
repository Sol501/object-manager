import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ObjectActionsDataService } from '../../../../../../../../../../../core/object-actions/object-actions.data.service';
import { ObjectAction } from '../../../../../../../../../../../core/object-actions/object-action.models';

@Injectable()
export class ActionsFacade {
  private readonly _data = inject(ObjectActionsDataService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _items = signal<ObjectAction[]>([]);
  private readonly _status = signal<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  private readonly _error = signal<string | null>(null);

  readonly items = this._items.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();

  ensureLoaded(): void {
    if (this.status() === 'idle') this.load();
  }

  load(): void {
    if (this.status() === 'loading') return;
    this._status.set('loading');
    this._error.set(null);
    this._data
      .getAll()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (items) => {
          this._items.set(items);
          this._status.set('loaded');
        },
        error: () => {
          this._error.set('Could not load actions. Please try again.');
          this._status.set('error');
        },
      });
  }
}
