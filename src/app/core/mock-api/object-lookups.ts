import { ObjectInfoOptions } from '../objects/object.models';

export const OBJECT_INFO_OPTIONS: ObjectInfoOptions = {
  objectTypes: [
    'Organization',
    'Sector',
    'Department',
    'Section',
    'Excellency Axis',
    'Issue',
    'Process',
    'Service',
    'Strategic Goal',
    'Application',
    'Risk',
    'Policy',
    'Employee',
    'Audit Plan',
    'Vision',
  ].map((label) => ({ id: label, label })),
  people: [
    { id: '1', label: '1' },
    { id: '2', label: '2' },
  ],
  responsibilities: [
    { id: '1', label: '1' },
    { id: '2', label: '2' },
  ],
};
