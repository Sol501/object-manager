import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { AttributeInputForm } from '../../../../../../../../../../../../attribute-input-form.model';
import { AdvancedPreviewService } from '../../../../../../../../../../../../advanced-preview.service';
import {
  DevextremeService,
  DevextremeWidget,
} from '../../../../../../../../../../../../devextreme.service';
import { GanttColumnsComponent } from '../gantt-columns/gantt-columns.component';

@Component({
  selector: 'app-reference-widget',
  standalone: true,
  imports: [GanttColumnsComponent],
  templateUrl: './reference-widget.component.html',
  styleUrl: './reference-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferenceWidgetComponent {
  private readonly _container = inject(ControlContainer);
  private readonly _runtime = inject(DevextremeService);
  private readonly _previews = inject(AdvancedPreviewService);
  private readonly _destroy = inject(DestroyRef);
  private readonly _host = viewChild.required<ElementRef<HTMLElement>>('host');
  private _widget?: DevextremeWidget;
  private _resize?: ResizeObserver;
  private _width = 0;
  private _repaintFrame = 0;
  readonly error = signal('');
  readonly manageColumns = signal(false);
  get group(): AttributeInputForm {
    return this._container.control as AttributeInputForm;
  }
  constructor() {
    afterNextRender(() => {
      void this._mount();
    });
    this._destroy.onDestroy(() => {
      this._resize?.disconnect();
      cancelAnimationFrame(this._repaintFrame);
      this._widget?.dispose();
    });
  }
  private async _mount(): Promise<void> {
    try {
      const runtime = await this._runtime.load();
      if (this._destroy.destroyed) return;
      const host = this._host().nativeElement;
      if (this.group.controls.kind.value === 'data-grid') {
        const employees = this._previews.stateFor(this.group, () =>
          structuredClone(runtime.employees),
        );
        this._widget = new runtime.DevExpress.ui.dxDataGrid(host, {
          dataSource: employees,
          keyExpr: 'ID',
          showBorders: true,
          paging: { pageSize: 5 },
          editing: { mode: 'row', allowUpdating: true, allowDeleting: true, allowAdding: true },
          columns: [
            { dataField: 'Prefix', caption: 'Title' },
            'FirstName',
            'LastName',
            { dataField: 'Position', width: '8.125rem' },
            {
              dataField: 'StateID',
              caption: 'State',
              width: '7.8125rem',
              lookup: { dataSource: runtime.states, displayExpr: 'Name', valueExpr: 'ID' },
            },
            { dataField: 'BirthDate', dataType: 'date', width: '7.8125rem' },
          ],
        });
      } else {
        const data = this._previews.stateFor(this.group, () =>
          structuredClone({
            tasks: runtime.tasks,
            dependencies: runtime.dependencies,
            resources: runtime.resources,
            resourceAssignments: runtime.resourceAssignments,
          }),
        );
        this._widget = new runtime.DevExpress.ui.dxGantt(host, {
          height: '31.25rem',
          tasks: { dataSource: data.tasks },
          dependencies: { dataSource: data.dependencies },
          resources: { dataSource: data.resources },
          resourceAssignments: { dataSource: data.resourceAssignments },
          editing: { enabled: true },
          validation: { autoUpdateParentTasks: true },
          toolbar: {
            items: [
              'undo',
              'redo',
              'separator',
              'collapseAll',
              'expandAll',
              'separator',
              'addTask',
              'deleteTask',
              'separator',
              'zoomIn',
              'zoomOut',
              {
                widget: 'dxButton',
                options: {
                  text: 'Manage Columns',
                  icon: 'info',
                  stylingMode: 'text',
                  onClick: () => this.manageColumns.set(true),
                },
              },
            ],
          },
          columns: this._columns(false),
          scaleType: 'weeks',
          taskListWidth: this._rem(31.25),
        });
      }
      this._resize = new ResizeObserver(([entry]) => {
        if (entry.contentRect.width === this._width) return;
        this._width = entry.contentRect.width;
        cancelAnimationFrame(this._repaintFrame);
        if (!this._width) return;
        this._repaintFrame = requestAnimationFrame(() => this._widget?.repaint());
      });
      this._resize.observe(host);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Could not load the input.');
    }
  }
  saveColumns(columns: string[]): void {
    if (!columns.length) {
      this.manageColumns.set(false);
      return;
    }
    this.group.controls.columns.setValue(columns);
    this.group.markAsDirty();
    this._widget?.option('columns', this._columns(true));
    this.manageColumns.set(false);
  }
  private _columns(configured: boolean) {
    const labels: Record<string, string> = {
      title: 'Subject',
      start: 'Start Date',
      end: 'End Date',
      progress: 'Progress',
    };
    return this.group.controls.columns.value.map((field) => ({
      dataField: field,
      caption: labels[field],
      ...(configured
        ? { width: this._rem(6.25) }
        : field === 'title'
          ? { width: this._rem(12.5) }
          : {}),
    }));
  }
  private _rem(size: number): number {
    const document = this._host().nativeElement.ownerDocument;
    return (
      size *
      Number.parseFloat(document.defaultView!.getComputedStyle(document.documentElement).fontSize)
    );
  }
}
