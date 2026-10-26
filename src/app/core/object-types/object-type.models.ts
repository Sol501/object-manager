export interface ObjectTypeIcon {
  name: string;
  type: string;
  dataUrl: string;
}

export interface ObjectTypeGeneralInfo {
  code: string;
  prefix: string;
  icon: ObjectTypeIcon | null;
  name: string;
  description: string;
  protected: boolean;
  measurable: boolean;
  auditTrail: boolean;
}

export interface ObjectTypeFormValue {
  generalInfo: Omit<ObjectTypeGeneralInfo, 'icon'> & { icon: File | null };
  attributes: ObjectTypeAttributes;
  responsibilities: ObjectTypeResponsibilities;
  linkedObjectTypes: ObjectTypeRelationship;
  actions: ObjectTypeActionSelection & { search: string };
}

export interface ObjectTypeActionSelection {
  selection: boolean[];
}

export interface ObjectTypeRelationship {
  id: string;
  activeName: string;
  passiveName: string;
  targetObjectTypeName: string;
  impact: 'Very high' | 'Medium' | 'Very low';
  relation: 'One to Many' | 'Many to Many';
}

export interface ObjectTypeResponsibilities {
  userOrGroupName: string;
  responsibility: 'View' | 'Edit' | 'Remove';
}

export type AttributeLanguage = 'English' | 'Arabic' | 'French' | 'Chinese';

export interface AttributeTabTranslation {
  language: AttributeLanguage;
  title: string;
  description: string;
}

export interface AttributeCardLayout {
  column: number;
  row: number;
  columns: number;
  rows: number;
}

export interface AttributeCard {
  id: string;
  title: string;
  backgroundColor: string;
  layout: AttributeCardLayout;
  inputs: AttributeInput[];
}

export interface AttributeTab {
  id: string;
  translations: AttributeTabTranslation[];
  personaIds: string[];
  roleIds: string[];
  cards: AttributeCard[];
}

export interface ObjectTypeAttributes {
  tabs: AttributeTab[];
}

export type ObjectTypeStatus = 'draft' | 'submitted';

export interface ObjectTypeSaveRequest {
  generalInfo: ObjectTypeGeneralInfo;
  attributes: ObjectTypeAttributes;
  responsibilities: ObjectTypeResponsibilities;
  linkedObjectTypes: ObjectTypeRelationship;
  actions: ObjectTypeActionSelection;
  status: ObjectTypeStatus;
}

export interface SavedObjectType extends ObjectTypeSaveRequest {
  id: string;
}

export const ATTRIBUTE_INPUT_KINDS = [
  'text',
  'checkbox',
  'date',
  'file',
  'number',
  'radio',
  'select',
  'textarea',
  'data-grid',
  'dynamic-grid',
  'gantt',
  'tasks-board',
] as const;
export type AttributeInputKind = (typeof ATTRIBUTE_INPUT_KINDS)[number];

export interface AttributeInputTranslation {
  language: AttributeLanguage;
  label: string;
  description: string;
}

export interface AttributeInputOption {
  id: string;
  labelEn: string;
  labelAr: string;
}

export interface AttributeInputValidation {
  validateOn: 'Change' | 'Blur';
  required: boolean;
  unique: boolean;
  minLength: number | null;
  maxLength: number | null;
  minWords: number | null;
  maxWords: number | null;
  pattern: string;
  errorLabel: string;
  customMessage: string;
}

export interface AttributeInput {
  id: string;
  kind: AttributeInputKind;
  translations: AttributeInputTranslation[];
  dataType: '' | 'Boolean' | 'Int' | 'Char';
  priority: '' | 'High' | 'Medium' | 'Low';
  languageDependent: boolean;
  validation: AttributeInputValidation;
  conditional: { display: boolean; fieldId: string; equals: string };
  dataSource: { type: string; source: string };
  personaIds: string[];
  roleIds: string[];
  options: AttributeInputOption[];
  columns: string[];
}
