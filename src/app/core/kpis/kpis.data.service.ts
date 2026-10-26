import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Kpi } from './kpi.models';

interface KpisResponse {
  data: Kpi[];
}

@Injectable({ providedIn: 'root' })
export class KpisDataService {
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = inject(API_BASE_URL).replace(/\/$/, '');

  getAll(): Observable<Kpi[]> {
    return this._http
      .get<KpisResponse>(`${this._baseUrl}/kpis.php`)
      .pipe(map((response) => response.data));
  }
}
