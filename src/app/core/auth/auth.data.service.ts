import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { AuthCredentials, AuthSession, LoginResponse } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthDataService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_BASE_URL);

  login(credentials: AuthCredentials): Observable<AuthSession> {
    const body = new FormData();
    body.set('email', credentials.email);
    body.set('password', credentials.password);

    return this.http.post<LoginResponse>(`${this.apiUrl}/login.php`, body).pipe(
      map((response) => {
        if (response?.code !== 1) {
          throw new Error(response?.message?.trim() || 'Unable to login. Please try again.');
        }

        const data = response.data;

        if (
          !data ||
          Array.isArray(data) ||
          typeof data.accessToken !== 'string' ||
          !data.accessToken.trim() ||
          typeof data.userID !== 'string' ||
          typeof data.email !== 'string'
        ) {
          throw new Error('The server returned an invalid login response. Please try again.');
        }

        const modifiedResponse: AuthSession = {
          accessToken: data.accessToken,
          user: { id: data.userID, email: data.email },
        }

        return modifiedResponse;
      }),
    );
  }
}
