import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import {
  ObjectTypeFormValue,
  ObjectTypeIcon,
  ObjectTypeSaveRequest,
  ObjectTypeStatus,
  SavedObjectType,
} from './object-type.models';

@Injectable({ providedIn: 'root' })
export class ObjectTypesDataService {
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = inject(API_BASE_URL).replace(/\/$/, '');

  save(value: ObjectTypeFormValue, status: ObjectTypeStatus): Observable<SavedObjectType> {
    const info = value.generalInfo;

    return this._readIcon(info.icon).pipe(
      switchMap((icon) => {
        const body: ObjectTypeSaveRequest = {
          generalInfo: {
            ...info,
            code: info.code.trim(),
            prefix: info.prefix.trim(),
            name: info.name.trim(),
            description: info.description.trim(),
            icon,
          },
          attributes: {
            tabs: value.attributes.tabs.map((tab) => ({
              ...tab,
              translations: tab.translations.map((translation) => ({
                ...translation,
                title: translation.title.trim(),
                description: translation.description.trim(),
              })),
              cards: tab.cards.map((card) => ({
                ...card,
                title: card.title.trim(),
                inputs: card.inputs.map((input) => ({
                  ...input,
                  translations: input.translations.map((translation) => ({
                    ...translation,
                    label: translation.label.trim(),
                    description: translation.description.trim(),
                  })),
                  options: input.options.map((option) => ({
                    ...option,
                    labelEn: option.labelEn.trim(),
                    labelAr: option.labelAr.trim(),
                  })),
                })),
              })),
            })),
          },
          responsibilities: value.responsibilities,
          linkedObjectTypes: value.linkedObjectTypes,
          actions: { selection: value.actions.selection },
          status,
        };

        return this._http.post<SavedObjectType>(`${this._baseUrl}/object-types.php`, body);
      }),
    );
  }

  private _readIcon(file: File | null): Observable<ObjectTypeIcon | null> {
    if (!file) {
      return of(null);
    }

    return new Observable((subscriber) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== 'string') {
          subscriber.error(new Error('Could not read the icon file.'));
          return;
        }

        subscriber.next({ name: file.name, type: file.type, dataUrl: reader.result });
        subscriber.complete();
      };
      reader.onerror = () => subscriber.error(new Error('Could not read the icon file.'));
      reader.readAsDataURL(file);

      return () => {
        if (reader.readyState === FileReader.LOADING) {
          reader.abort();
        }
      };
    });
  }
}
