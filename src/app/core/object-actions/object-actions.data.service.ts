import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { ObjectAction } from './object-action.models';

interface ObjectActionsResponse {
  data: ObjectAction[];
}

@Injectable({ providedIn: 'root' })
export class ObjectActionsDataService {
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = inject(API_BASE_URL).replace(/\/$/, '');

  getAll(): Observable<ObjectAction[]> {
    return this._http
      .get<ObjectActionsResponse>(`${this._baseUrl}/object-actions.php`)
      .pipe(map((response) => response.data));
  }
}
