import { Subordinate } from '../subordinates/subordinate.models';

export const MOCK_SUBORDINATES: Subordinate[] = [
  {
    id: '1',
    name: 'object 1',
    type: 'Organization',
    active: true,
    state: 'Operational',
    subordinateCount: 3,
  },
  {
    id: '2',
    name: 'obj2',
    type: 'Sector',
    active: false,
    state: 'Draft',
    subordinateCount: 0,
  },
  {
    id: '3',
    name: 'test',
    type: 'Department',
    active: true,
    state: 'Operational',
    subordinateCount: 7,
  },
  {
    id: '4',
    name: 'obj 44',
    type: 'Department',
    active: false,
    state: 'Draft',
    subordinateCount: 2,
  },
  {
    id: '5',
    name: 'test object',
    type: 'Section',
    active: true,
    state: 'Operational',
    subordinateCount: 1,
  },
];
