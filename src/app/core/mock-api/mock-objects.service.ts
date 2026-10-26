import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectSaveRequest, SavedObject } from '../objects/object.models';

@Injectable({ providedIn: 'root' })
export class MockObjectsService {
  save(body: unknown): SavedObject {
    const request = body as ObjectSaveRequest | null;
    if (!request?.objectInfo || !['draft', 'submitted'].includes(request.status)) {
      throw new HttpErrorResponse({ status: 400, error: { message: 'Invalid object data.' } });
    }
    return { ...request, id: crypto.randomUUID() };
  }
}
