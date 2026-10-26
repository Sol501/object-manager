import { Kpi } from '../kpis/kpi.models';

export const MOCK_KPIS: Kpi[] = [
  {
    id: '1',
    name: 'kpi 1',
    aggregated: false,
    source: 'Manual',
    state: 'Operational',
  },
  {
    id: '2',
    name: 'test kpi',
    aggregated: true,
    source: 'Manual',
    state: 'Draft',
  },
  {
    id: '3',
    name: 'kpi3',
    aggregated: true,
    source: 'Automatic',
    state: 'Operational',
  },
  {
    id: '4',
    name: 'abc',
    aggregated: false,
    source: 'Manual',
    state: 'Draft',
  },
  {
    id: '5',
    name: 'kpi 22',
    aggregated: false,
    source: 'Automatic',
    state: 'Operational',
  },
];
