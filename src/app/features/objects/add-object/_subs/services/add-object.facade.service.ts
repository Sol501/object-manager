import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, inject,Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ObjectsDataService } from '../../../../../core/objects/objects.data.service';
import {
 ObjectFormValue,
  ObjectInfoOptions,
  ObjectStatus,
  SavedObject,
} from '../../../../../core/objects/object.models';

@Injectable()
export class AddObjectFacade {
  private readonly _data = inject(ObjectsDataService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _options = signal<ObjectInfoOptions | null>(null);
  private readonly _loading = signal( false);
  private readonly _saving = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _saved = signal<SavedObject | null>(null);

  readonly options =  this._options.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly saving = this._saving.asReadonly();
  readonly error = this._error.asReadonly();
  readonly saved = this._saved.asReadonly();

  loadOptions(): void {
    if (this._loading()) {
      return;
    }

    this._loading.set(true);
    this._error.set(null);
    this._data
      .getOptions()
       .pipe(
        takeUntilDestroyed(this._destroyRef),
        finalize(() => this._loading.set(false)),
      )
      .subscribe({
        next: (options) => this._options.set(options),
        error: () => this._error.set('Could not load the form options. Try again.'),
      });
  }

  save(value: ObjectFormValue, status:ObjectStatus): void {
    if (this._saving()) {
      return;
    }

    this._saving.set(true);
    this._error.set(null);
    this._saved.set(null);
    this._data
      .save(value, status)
      .pipe(
       takeUntilDestroyed(this._destroyRef),
        finalize(() => this._saving.set(false)),
      )
      .subscribe({
        next:  (saved) => this._saved.set(saved),
        error: (error: unknown) =>
          this._error.set(
            error instanceof HttpErrorResponse && typeof error.error?.message === 'string'
              ? error.error.message
              : 'Could not save the object. Try again.',
           ),
      });
 }

  clearResult(): void {
    this._saved.set(null);
    this._error.set(null);
  }
}
