import { FormArray, FormBuilder } from '@angular/forms';
import {
  AttributeCard,
  AttributeTab,
  AttributeTabTranslation,
} from '../../../../../../../../../core/object-types/object-type.models';

import { createAttributeInput } from './attribute-input-form.model';

const builder = new FormBuilder().nonNullable;
export const ATTRIBUTE_LANGUAGES = ['English', 'Arabic', 'French', 'Chinese'] as const;

export function createTabTranslation(value?: AttributeTabTranslation) {
  return builder.group({
    language: builder.control<AttributeTabTranslation['language']>(value?.language ?? 'English'),
    title: value?.title ?? 'Step Title',
    description: value?.description ?? '',
  });
}

export function createAttributeCard(value?: AttributeCard) {
  return builder.group({
    id: value?.id ?? crypto.randomUUID(),
    title: value?.title ?? 'Card Title',
    backgroundColor: value?.backgroundColor ?? '#FFFFFF',
    layout: builder.group(value?.layout ?? { column: 1, row: 1, columns: 6, rows: 2 }),
    inputs: new FormArray(
      (value?.inputs ?? []).map((input) => createAttributeInput(input.kind, input)),
    ),
  });
}

export function createAttributeTab(value?: AttributeTab) {
  return builder.group({
    id: value?.id ?? crypto.randomUUID(),
    translations: new FormArray((value?.translations ?? [undefined]).map(createTabTranslation)),
    personaIds: builder.control<string[]>(value?.personaIds ?? []),
    roleIds: builder.control<string[]>(value?.roleIds ?? []),
    cards: new FormArray((value?.cards ?? []).map(createAttributeCard)),
  });
}

export function createAttributesForm() {
  return builder.group({ tabs: new FormArray([createAttributeTab()]) });
}

export type AttributeCardForm = ReturnType<typeof createAttributeCard>;
export type AttributeTabForm = ReturnType<typeof createAttributeTab>;
export type AttributesForm = ReturnType<typeof createAttributesForm>;
export type AttributeTabSettings = Omit<AttributeTab, 'id' | 'cards'>;
