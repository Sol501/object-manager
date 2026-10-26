import { FormArray, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { AttributeInputForm } from './attribute-input-form.model';

@Injectable()
export class AdvancedPreviewService {
  private readonly _values = new WeakMap<AttributeInputForm, unknown>();
  private readonly _opened = new WeakSet<AttributeInputForm>();
  stateFor<T>(group: AttributeInputForm, create: () => T): T {
    if (!this._values.has(group)) this._values.set(group, create());
    return this._values.get(group) as T;
  }
  duplicateTable(from: AttributeInputForm, to: AttributeInputForm): void {
    const previous = this._values.get(from) as { rows: string[][] } | undefined;
    if (previous)
      this._values.set(to, {
        rows: previous.rows.map((row) => [...row]),
        draft: new FormArray(
          to.controls.columns.value.map(() => new FormControl('', { nonNullable: true })),
        ),
      });
  }
  requestSettings(group: AttributeInputForm): void {
    this._opened.add(group);
  }
  takeSettings(group: AttributeInputForm): boolean {
    const requested = this._opened.has(group);
    this._opened.delete(group);
    return requested;
  }
}
