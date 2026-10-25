import { Injectable } from '@angular/core';
import { AuthSession } from './auth.models';

function isAuthSession(value: unknown): value is AuthSession {
  return (
    typeof value === 'object' &&
    value !== null &&
    'accessToken' in value &&
    typeof value.accessToken === 'string' &&
    value.accessToken.trim().length > 0 &&
    'user' in value &&
    typeof value.user === 'object' &&
    value.user !== null &&
    'id' in value.user &&
    typeof value.user.id === 'string' &&
    value.user.id.trim().length > 0 &&
    'email' in value.user &&
    typeof value.user.email === 'string' &&
    value.user.email.trim().length > 0
  );
}

@Injectable({ providedIn: 'root' })
export class AuthStorageService {
  private readonly _key = 'object-manager.auth';

  read(): AuthSession | null {
    try {
      const stored = localStorage.getItem(this._key);
      if (stored === null) {
        return null;
      }

      const session: unknown = JSON.parse(stored);
      if (isAuthSession(session)) {
        return {
          accessToken: session.accessToken,
          user: { id: session.user.id, email: session.user.email },
        };
      }
    } catch {
      this.clear();
      return null;
    }

    this.clear();
    return null;
  }

  save(session: AuthSession): void {
    try {
      localStorage.setItem(
        this._key,
        JSON.stringify({
          accessToken: session.accessToken,
          user: { id: session.user.id, email: session.user.email },
        }),
      );
    } catch {
      this.clear();
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this._key);
    } catch {
      return;
    }
  }
}
