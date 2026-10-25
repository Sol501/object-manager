import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { of, Subject, Subscription, throwError } from 'rxjs';
import { AuthDataService } from '../auth.data.service';
import { AuthSession } from '../auth.models';
import { AuthStorageService } from '../auth.storage.service';
import { AuthActions } from './auth.actions';
import { AuthEffects } from './auth.effects';

describe('AuthEffects', () => {
  let actions: Subject<Action>;
  let effects: AuthEffects;
  let subscriptions: Subscription;
  let authData: { login: jest.Mock };
  let router: { navigateByUrl: jest.Mock };
  let storage: { save: jest.Mock; clear: jest.Mock };
  const credentials = { email: 'user@example.test', password: 'test-password' };
  const session: AuthSession = {
    accessToken: 'test-token',
    user: { id: '12', email: credentials.email },
  };

  beforeEach(() => {
    actions = new Subject<Action>();
    subscriptions = new Subscription();
    authData = { login: jest.fn() };
    router = { navigateByUrl: jest.fn().mockResolvedValue(true) };
    storage = { save: jest.fn(), clear: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions),
        { provide: AuthDataService, useValue: authData },
        { provide: Router, useValue: router },
        { provide: AuthStorageService, useValue: storage },
      ],
    });
    effects = TestBed.inject(AuthEffects);
  });

  afterEach(() => {
    subscriptions.unsubscribe();
    actions.complete();
  });

  it('can login again after error', () => {
    authData.login
      .mockReturnValueOnce(throwError(() => new Error('Incorrect login')))
      .mockReturnValueOnce(of(session));
    const emitted: Action[] = [];
    subscriptions.add(effects.login$.subscribe((action) => emitted.push(action)));

    actions.next(AuthActions.loginSubmitted({ credentials }));
    actions.next(AuthActions.loginSubmitted({ credentials }));

    expect(authData.login).toHaveBeenCalledWith(credentials);
    expect(emitted).toEqual([
      AuthActions.loginFailed({ error: 'Incorrect login' }),
      AuthActions.loginSucceeded({ session }),
    ]);
  });

  it('ignores double submit', () => {
    const response = new Subject<AuthSession>();
    authData.login.mockReturnValue(response);
    const next = jest.fn();
    subscriptions.add(effects.login$.subscribe(next));

    actions.next(AuthActions.loginSubmitted({ credentials }));
    actions.next(AuthActions.loginSubmitted({ credentials }));
    expect(authData.login).toHaveBeenCalledTimes(1);

    response.next(session);
    response.complete();
    expect(next).toHaveBeenCalledWith(AuthActions.loginSucceeded({ session }));
  });

  it('network error', () => {
    authData.login.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 0 })));
    const next = jest.fn();
    subscriptions.add(effects.login$.subscribe(next));
    actions.next(AuthActions.loginSubmitted({ credentials }));

    expect(next).toHaveBeenCalledWith(
      AuthActions.loginFailed({
        error: 'Unable to reach the server. Check your connection then try again.',
      }),
    );
  });

  it('save and clear session', () => {
    subscriptions.add(effects.loginSuccess$.subscribe());
    subscriptions.add(effects.logout$.subscribe());

    actions.next(AuthActions.loginSucceeded({ session }));
    expect(storage.save).toHaveBeenCalledWith(session);
    expect(router.navigateByUrl).toHaveBeenLastCalledWith('/objects');

    actions.next(AuthActions.sessionExpired());
    expect(storage.clear).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl).toHaveBeenLastCalledWith('/login');

    actions.next(AuthActions.logoutRequested());
    expect(storage.clear).toHaveBeenCalledTimes(2);
    expect(router.navigateByUrl).toHaveBeenLastCalledWith('/login');
  });

  it('restore should stay on the same page', () => {
    subscriptions.add(effects.loginSuccess$.subscribe());
    subscriptions.add(effects.logout$.subscribe());

    actions.next(AuthActions.sessionRestored({ session }));

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(storage.save).not.toHaveBeenCalled();
    expect(storage.clear).not.toHaveBeenCalled();
  });
});
