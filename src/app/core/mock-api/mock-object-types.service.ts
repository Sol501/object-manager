import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectTypeSaveRequest, SavedObjectType } from '../object-types/object-type.models';

@Injectable({ providedIn: 'root' })
export class MockObjectTypesService {
  save(body: unknown): SavedObjectType {
    const request = body as ObjectTypeSaveRequest | null;
    if (
      !request?.generalInfo ||
      !request.attributes ||
      !['draft', 'submitted'].includes(request.status)
    ) {
      throw new HttpErrorResponse({ status: 400, error: { message: 'Invalid object type data.' } });
    }
    return { ...request, id: crypto.randomUUID() };
  }
}
