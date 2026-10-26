import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AttributeInputForm } from './attribute-input-form.model';

export type AttributePreviewValue = string | number | string[] | File[] | null;

@Injectable()
export class AttributePreviewService {
  private readonly _controls = new WeakMap<
    AttributeInputForm,
    FormControl<AttributePreviewValue>
  >();

  controlFor(group: AttributeInputForm, refresh = false): FormControl<AttributePreviewValue> {
    const previous = this._controls.get(group);
    if (previous && !refresh) return previous;
    const definition = group.getRawValue();
    let value =
      previous?.value ?? (definition.kind === 'checkbox' || definition.kind === 'file' ? [] : '');
    const optionIds = definition.options.map((option) => option.id);
    if (definition.kind === 'checkbox')
      value = (value as string[]).filter((id) => optionIds.includes(id));
    if (
      (definition.kind === 'select' || definition.kind === 'radio') &&
      !optionIds.includes(value as string)
    )
      value = '';
    const control = new FormControl<AttributePreviewValue>(value);
    this._controls.set(group, control);
    return control;
  }
}
