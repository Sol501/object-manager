import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

export interface DevextremeWidget {
  dispose(): void;
  repaint(): void;
  option(name: string, value: unknown): void;
}
type Row = Record<string, unknown>;
type WidgetConstructor = new (
  element: HTMLElement,
  options: Record<string, unknown>,
) => DevextremeWidget;
interface WidgetWindow extends Window {
  DevExpress: { ui: { dxDataGrid: WidgetConstructor; dxGantt: WidgetConstructor } };
  employees: Row[];
  states: Row[];
  tasks: Row[];
  dependencies: Row[];
  resources: Row[];
  resourceAssignments: Row[];
}

@Injectable({ providedIn: 'root' })
export class DevextremeService {
  private readonly _document = inject(DOCUMENT);
  private _ready?: Promise<WidgetWindow>;

  load(): Promise<WidgetWindow> {
    return (this._ready ??= this._load());
  }

  private async _load(): Promise<WidgetWindow> {
    const root = 'assets/vendor/devexpress';
    await Promise.all(
      [
        '20.2.3/css/dx.common.css',
        '20.2.3/css/dx.light.css',
        '20.2.3/css/dx-gantt.min.css',
        'devexpress.css',
      ].map((file) => this._asset(`${root}/${file}`, true)),
    );
    for (const file of [
      '20.2.3/js/dx-gantt.min.js',
      '20.2.3/js/dx.all.js',
      'data.js',
      'GanttData/Ganttdata.js',
    ])
      await this._asset(`${root}/${file}`, false);
    return this._document.defaultView as unknown as WidgetWindow;
  }

  private _asset(url: string, stylesheet: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      const element = this._document.createElement(stylesheet ? 'link' : 'script');
      if (element instanceof HTMLLinkElement) {
        element.rel = 'stylesheet';
        element.href = url;
      } else {
        element.src = url;
        element.async = false;
      }
      element.onload = () => resolve();
      element.onerror = () => reject(new Error(`Could not load ${url}`));
      this._document.head.append(element);
    });
  }
}
