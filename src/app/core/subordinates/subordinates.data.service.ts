import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Subordinate } from './subordinate.models';

interface SubordinatesResponse {
  data: Subordinate[];
}

@Injectable({ providedIn: 'root' })
export class SubordinatesDataService {
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = inject(API_BASE_URL).replace(/\/$/, '');

  getAll(): Observable<Subordinate[]> {
    return this._http
      .post<SubordinatesResponse>(`${this._baseUrl}/subordinates.php`, new FormData())
      .pipe(map((response) => response.data));
  }
}
