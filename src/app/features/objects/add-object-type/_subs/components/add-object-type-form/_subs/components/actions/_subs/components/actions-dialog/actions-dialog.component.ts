import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { ButtonDirective } from '../../../../../../../../../../../../shared/ui/button/button.directive';
import { DialogComponent } from '../../../../../../../../../../../../shared/ui/dialog/dialog.component';
import { TableDirective } from '../../../../../../../../../../../../shared/ui/table/table.directive';
import { TableSearchComponent } from '../../../../../../../../../../../../shared/ui/table-search/table-search.component';
import { ToggleSwitchComponent } from '../../../../../../../../../../../../shared/ui/toggle-switch/toggle-switch.component';
import { ObjectTypeActionsForm } from '../../../../../../add-object-type-form.model';

@Component({
  selector: 'app-object-type-actions-dialog',
  standalone: true,
  imports: [
    ButtonDirective,
    DialogComponent,
    TableDirective,
    TableSearchComponent,
    ToggleSwitchComponent,
  ],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './actions-dialog.component.html',
  styleUrl: './actions-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectTypeActionsDialogComponent {
  private readonly _container = inject(ControlContainer);
  readonly closed = output<void>();

  get group(): ObjectTypeActionsForm {
    return this._container.control as ObjectTypeActionsForm;
  }

  setSearch(value: string): void {
    if (this.group.disabled) return;
    const control = this.group.controls.search;
    control.setValue(value);
    control.markAsDirty();
  }

  select(index: number, checked: boolean): void {
    if (this.group.disabled) return;
    const control = this.group.controls.selection.at(index);
    control.setValue(checked);
    control.markAsDirty();
  }
}
