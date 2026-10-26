import { AbstractControl, FormArray, FormBuilder } from '@angular/forms';
import {
  AttributeInput,
  AttributeInputKind,
  AttributeInputOption,
  AttributeInputTranslation,
} from '../../../../../../../../../core/object-types/object-type.models';

const builder = new FormBuilder().nonNullable;
export const BASIC_INPUT_TYPES = [
  { kind: 'text', label: 'Text field', icon: 'textfield.svg', fieldLabel: 'Label' },
  { kind: 'checkbox', label: 'Checkbox', icon: 'checkbox.svg', fieldLabel: 'Checkbox' },
  {
    kind: 'date',
    label: 'Date Field',
    icon: '../vendor/fontawesome-free-5.9.0-web/svgs/regular/calendar-alt.svg',
    fieldLabel: 'Date',
  },
  { kind: 'file', label: 'File Upload', icon: 'FileUpload.svg', fieldLabel: 'File Upload' },
  { kind: 'number', label: 'Number', icon: 'Number.svg', fieldLabel: 'Number' },
  { kind: 'radio', label: 'Radio button', icon: 'radio-on-button.svg', fieldLabel: 'Redio' },
  { kind: 'select', label: 'Select', icon: 'Selectddl.svg', fieldLabel: 'Select' },
  { kind: 'textarea', label: 'Textarea', icon: 'textarea.svg', fieldLabel: 'Text Area' },
] as const;
export const ADVANCED_INPUT_TYPES = [
  { kind: 'data-grid', label: 'Data Grid', icon: 'DataGrid.svg', fieldLabel: '' },
  { kind: 'dynamic-grid', label: 'Dynamic Data Grid', icon: 'DataGrid.svg', fieldLabel: '' },
  { kind: 'gantt', label: 'Gantt Chart', icon: 'gannt.svg', fieldLabel: '' },
  { kind: 'tasks-board', label: 'Tasks Board', icon: 'scrumboard.svg', fieldLabel: '' },
] as const;

export function hasInputOptions(kind: AttributeInputKind): boolean {
  return ['checkbox', 'radio', 'select'].includes(kind);
}

export function createInputTranslation(value: AttributeInputTranslation) {
  return builder.group({ ...value });
}

export function createInputOption(value?: AttributeInputOption) {
  return builder.group(
    value ? { ...value } : { id: crypto.randomUUID(), labelEn: '', labelAr: '' },
  );
}

export function createAttributeInput(kind: AttributeInputKind, value?: AttributeInput) {
  const defaultLabel = [...BASIC_INPUT_TYPES, ...ADVANCED_INPUT_TYPES].find(
    (input) => input.kind === kind,
  )!.fieldLabel;
  const options =
    value?.options ??
    (kind === 'checkbox' || kind === 'radio'
      ? [{ id: crypto.randomUUID(), labelEn: 'Option name', labelAr: '' }]
      : []);
  return builder.group({
    id: value?.id ?? crypto.randomUUID(),
    kind: builder.control<AttributeInputKind>(kind),
    translations: new FormArray(
      (value?.translations ?? [{ language: 'English', label: defaultLabel, description: '' }]).map(
        createInputTranslation,
      ),
    ),
    dataType: builder.control<AttributeInput['dataType']>(value?.dataType ?? ''),
    priority: builder.control<AttributeInput['priority']>(value?.priority ?? ''),
    languageDependent: value?.languageDependent ?? false,
    validation: builder.group({
      validateOn: builder.control<'Change' | 'Blur'>(value?.validation.validateOn ?? 'Change'),
      required: value?.validation.required ?? false,
      unique: value?.validation.unique ?? false,
      minLength: builder.control<number | null>(value?.validation.minLength ?? null),
      maxLength: builder.control<number | null>(value?.validation.maxLength ?? null),
      minWords: builder.control<number | null>(value?.validation.minWords ?? null),
      maxWords: builder.control<number | null>(value?.validation.maxWords ?? null),
      pattern: value?.validation.pattern ?? '',
      errorLabel: value?.validation.errorLabel ?? '',
      customMessage: value?.validation.customMessage ?? '',
    }),
    conditional: builder.group(
      value?.conditional ? { ...value.conditional } : { display: true, fieldId: '', equals: '' },
    ),
    dataSource: builder.group(
      value?.dataSource ? { ...value.dataSource } : { type: '', source: '' },
    ),
    personaIds: builder.control([...(value?.personaIds ?? [])]),
    roleIds: builder.control([...(value?.roleIds ?? [])]),
    options: new FormArray(options.map(createInputOption)),
    columns: builder.control([
      ...(value?.columns ?? (kind === 'gantt' ? ['title', 'start', 'end'] : [])),
    ]),
  });
}

export type AttributeInputForm = ReturnType<typeof createAttributeInput>;

export function getAttributeInputs(root: AbstractControl): AttributeInputForm[] {
  const tabs = root.get('attributes.tabs') as FormArray | null;
  return (
    tabs?.controls.flatMap((tab) =>
      (tab.get('cards') as FormArray).controls.flatMap(
        (card) => (card.get('inputs') as FormArray<AttributeInputForm>).controls,
      ),
    ) ?? []
  );
}

export function clearInputReferences(root: AbstractControl, removedIds: string[]): void {
  for (const input of getAttributeInputs(root)) {
    if (removedIds.includes(input.controls.conditional.controls.fieldId.value)) {
      input.controls.conditional.patchValue({ fieldId: '', equals: '' });
    }
  }
}
