import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KpisDataService } from '../../../../../../../../../../../core/kpis/kpis.data.service';
import { Kpi } from '../../../../../../../../../../../core/kpis/kpi.models';

@Injectable()
export class LinkedKpisFacade {
  private readonly _data = inject(KpisDataService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _items = signal<Kpi[]>([]);
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
          this._error.set('Could not load KPIs. Please try again.');
          this._status.set('error');
        },
      });
  }
}
