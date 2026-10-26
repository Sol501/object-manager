import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { of, Subject, Subscription, throwError } from 'rxjs';
import { AuthActions } from '../../../../core/auth/state/auth.actions';
import { MOCK_SUBORDINATES } from '../../../../core/mock-api/subordinates';
import { Subordinate } from '../../../../core/subordinates/subordinate.models';
import { SubordinatesDataService } from '../../../../core/subordinates/subordinates.data.service';
import { SubordinatesActions } from './subordinates.actions';
import { SubordinatesEffects } from './subordinates.effects';

describe('subordinates effects', () => {
  let actions: Subject<Action>;
  let effects: SubordinatesEffects;
  let subscription: Subscription;
  let data: { getAll: jest.Mock };
  let next: jest.Mock;

  beforeEach(() => {
    actions = new Subject<Action>();
    data = { getAll: jest.fn() };
    next = jest.fn();
    TestBed.configureTestingModule({
      providers: [
        SubordinatesEffects,
        provideMockActions(() => actions),
        { provide: SubordinatesDataService, useValue: data },
      ],
    });
    effects = TestBed.inject(SubordinatesEffects);
    subscription = effects.load.subscribe(next);
  });
  afterEach(() => {
    subscription.unsubscribe();
    actions.complete();
  });

  it('loads and can retry after an error', () => {
    data.getAll
      .mockReturnValueOnce(throwError(() => new Error('Offline')))
      .mockReturnValueOnce(of(MOCK_SUBORDINATES));
    actions.next(SubordinatesActions.loadRequested());
    expect(next).toHaveBeenLastCalledWith(
      SubordinatesActions.loadFailed({ error: 'Could not load subordinates. Please try again.' }),
    );
    actions.next(SubordinatesActions.loadRequested());
    expect(next).toHaveBeenLastCalledWith(
      SubordinatesActions.loadSucceeded({ items: MOCK_SUBORDINATES }),
    );
  });

  it('ignores another load while one is pending', () => {
    const response = new Subject<Subordinate[]>();
    data.getAll.mockReturnValue(response);
    actions.next(SubordinatesActions.loadRequested());
    actions.next(SubordinatesActions.loadRequested());
    expect(data.getAll).toHaveBeenCalledTimes(1);
    response.next(MOCK_SUBORDINATES);
    response.complete();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('logout stops a pending response repopulating the store', () => {
    const response = new Subject<Subordinate[]>();
    data.getAll.mockReturnValueOnce(response).mockReturnValueOnce(of(MOCK_SUBORDINATES));
    actions.next(SubordinatesActions.loadRequested());
    actions.next(AuthActions.logoutRequested());
    response.next(MOCK_SUBORDINATES);
    expect(next).not.toHaveBeenCalled();
    actions.next(SubordinatesActions.loadRequested());
    expect(next).toHaveBeenCalledWith(
      SubordinatesActions.loadSucceeded({ items: MOCK_SUBORDINATES }),
    );
  });
});
