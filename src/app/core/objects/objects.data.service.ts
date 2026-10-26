import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import {
  ObjectFormValue,
  ObjectInfoOptions,
  ObjectSaveRequest,
  ObjectStatus,
  SavedObject,
} from './object.models';

@Injectable({ providedIn: 'root' })
export class ObjectsDataService {
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = inject(API_BASE_URL).replace(/\/$/, '');

  getOptions(): Observable<ObjectInfoOptions> {
    return this._http.get<ObjectInfoOptions>(`${this._baseUrl}/object-lookups.php`);
  }

  save(value: ObjectFormValue, status: ObjectStatus): Observable<SavedObject> {
    const body: ObjectSaveRequest = {
      ...value,
      objectInfo: {
        ...value.objectInfo,
        code: value.objectInfo.code.trim(),
        name: value.objectInfo.name.trim(),
        nameAr: value.objectInfo.nameAr.trim(),
        nameZh: value.objectInfo.nameZh.trim(),
      },
      status,
    };

    return this._http.post<SavedObject>(`${this._baseUrl}/objects.php`, body);
  }
}
