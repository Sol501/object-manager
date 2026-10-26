export interface ObjectInfo {
  objectTypeId: string;
  code: string;
  name: string;
  nameAr: string;
  nameZh: string;
  responsiblePersonId: string;
  responsibilityId: string;
  bypass: boolean;
}

export interface ObjectFormValue {
  objectInfo: ObjectInfo;
  subordinates: { selectedIds: string[] };
  linkedKpis: { selectedIds: string[] };
  actions: { selectedIds: string[] };
}

export interface ObjectLookupOption {
  id: string;
  label: string;
}

export interface ObjectInfoOptions {
  objectTypes: readonly ObjectLookupOption[];
  people: readonly ObjectLookupOption[];
  responsibilities: readonly ObjectLookupOption[];
}

export type ObjectStatus = 'draft' | 'submitted';

export interface ObjectSaveRequest extends ObjectFormValue {
  status: ObjectStatus;
}

export interface SavedObject extends ObjectSaveRequest {
  id: string;
}
