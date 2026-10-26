import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import {
  ObjectTypeFormValue,
  ObjectTypeStatus,
  SavedObjectType,
} from '../../../../../core/object-types/object-type.models';
import { ObjectTypesDataService } from '../../../../../core/object-types/object-types.data.service';

@Injectable()
export class AddObjectTypeFacade {
  private readonly _data = inject(ObjectTypesDataService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _saving = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _saved = signal<SavedObjectType | null>(null);

  readonly saving = this._saving.asReadonly();
  readonly error = this._error.asReadonly();
  readonly saved = this._saved.asReadonly();

  save(value: ObjectTypeFormValue, status: ObjectTypeStatus): void {
    if (this._saving()) {
      return;
    }

    this._saving.set(true);
    this.clearResult();
    this._data.save(value, status).pipe(
      takeUntilDestroyed(this._destroyRef),
      finalize(() => this._saving.set(false)),
    ).subscribe({
      next: (saved) => this._saved.set(saved),
      error: (error: unknown) => this._error.set(
        error instanceof HttpErrorResponse && typeof error.error?.message === 'string'
          ? error.error.message
          : 'Could not save the object type. Try again.',
      ),
    });
  }

  clearResult(): void {
    this._error.set(null);
    this._saved.set(null);
  }
}
