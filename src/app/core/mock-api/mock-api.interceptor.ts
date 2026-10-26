import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, timer } from 'rxjs';
import { API_BASE_URL, MOCK_API_ENABLED } from '../config/api.config';
import { MockObjectsService } from './mock-objects.service';
import { OBJECT_INFO_OPTIONS } from './object-lookups';
import { MOCK_SUBORDINATES } from './subordinates';
import { MOCK_KPIS } from './kpis';
import { MOCK_OBJECT_ACTIONS } from './object-actions';

export const mockApiInterceptor: HttpInterceptorFn = (request, next) => {
  if (!inject(MOCK_API_ENABLED)) {
    return next(request);
  }

  const baseUrl = `${inject(API_BASE_URL).replace(/\/$/, '')}/`;
  if (!request.url.startsWith(baseUrl)) {
    return next(request);
  }

  const path = request.url.slice(baseUrl.length).split('?')[0];
  if (path === 'login.php') {
    return next(request);
  }

  const objects = inject(MockObjectsService);
  return timer(250).pipe(
    map(() => {
      if (path === 'subordinates.php' && request.method === 'POST') {
        return new HttpResponse({
          body: { data: MOCK_SUBORDINATES.map((item) => ({ ...item })) },
        });
      }
      if (path === 'kpis.php' && request.method === 'GET') {
        return new HttpResponse({ body: { data: MOCK_KPIS.map((item) => ({ ...item })) } });
      }
      if (path === 'object-actions.php' && request.method === 'GET') {
        return new HttpResponse({
          body: { data: MOCK_OBJECT_ACTIONS.map((item) => ({ ...item })) },
        });
      }
      if (path === 'object-lookups.php' && request.method === 'GET') {
        return new HttpResponse({ body: OBJECT_INFO_OPTIONS });
      }
      if (path === 'objects.php' && request.method === 'POST') {
        return new HttpResponse({ status: 201, body: objects.save(request.body) });
      }
      throw new HttpErrorResponse({
        status: 501,
        error: { message: 'This endpoint is not available yet.' },
      });
    }),
  );
};
