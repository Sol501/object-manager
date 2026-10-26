import { FormControl, FormGroup } from '@angular/forms';
import { ObjectInfo } from '../../../../../../core/objects/object.models';

export const OBJECT_FORM_STEPS = [
  { key: 'objectInfo', label: 'Object info' },
  { key: 'subordinates',  label: 'Subordinates' },
  { key: 'linkedKpis', label: 'Linked KPIs' },
  { key: 'actions', label: 'Actions' },
] as const;

export type ObjectInfoForm= FormGroup<{
  [Field in keyof ObjectInfo]: FormControl<ObjectInfo[Field]>;
}>;
