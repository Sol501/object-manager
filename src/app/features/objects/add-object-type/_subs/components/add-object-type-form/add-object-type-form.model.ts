import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ObjectTypeFormValue } from '../../../../../../core/object-types/object-type.models';

export const OBJECT_TYPE_FORM_STEPS = [
  { key: 'generalInfo', label: 'General info' },
  { key: 'attributes', label: 'Attributes' },
  { key: 'responsibilities', label: 'Responsibilities' },
  { key: 'linkedObjectTypes', label: 'Linked object types' },
  { key: 'actions', label: 'Actions' },
] as const;

export type GeneralInfoForm = FormGroup<{
  [Field in keyof ObjectTypeFormValue['generalInfo']]: FormControl<ObjectTypeFormValue['generalInfo'][Field]>;
}>;

export type ObjectTypeActionsForm = FormGroup<{
  search: FormControl<string>;
  selection: FormArray<FormControl<boolean>>;
}>;
