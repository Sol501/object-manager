import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiUrl,
});

export const MOCK_API_ENABLED = new InjectionToken<boolean>('MOCK_API_ENABLED', {
  providedIn: 'root',
  factory: () => environment.useMockApi,
});
