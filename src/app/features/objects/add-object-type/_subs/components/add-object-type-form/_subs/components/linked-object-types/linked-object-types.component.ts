import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { TableDirective } from '../../../../../../../../../shared/ui/table/table.directive';
import {
  RowActionsMenuComponent,
  RowMenuItem,
} from '../../../../../../../../../shared/ui/row-actions-menu/row-actions-menu.component';
import { RelationshipDialogComponent } from './_subs/components/relationship-dialog/relationship-dialog.component';
import { RelationshipChartComponent } from './_subs/components/relationship-chart/relationship-chart.component';

@Component({
  selector: 'app-linked-object-types',
  standalone: true,
  imports: [
    TableDirective,
    RowActionsMenuComponent,
    RelationshipDialogComponent,
    RelationshipChartComponent,
  ],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './linked-object-types.component.html',
  styleUrl: './linked-object-types.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedObjectTypesComponent {
  readonly active = input(true);
  readonly busy = input(false);
  readonly dialogOpen = signal(false);
  readonly rows = Array.from({ length: 8 }, (_, index) => ({
    key: index,
    id: '4312',
    activeName: 'Name goes here',
    passiveName: 'Name goes here',
  }));
  readonly rowActions: readonly RowMenuItem[] = [
    { id: 'view', label: 'View' },
    { id: 'deactivate', label: 'Deactivate' },
    { id: 'copy', label: 'Copy' },
    { id: 'duplicate', label: 'Duplicate' },
    { id: 'delete', label: 'Delete', danger: true },
  ];

  constructor() {
    effect(() => {
      if (!this.active() || this.busy()) this.dialogOpen.set(false);
    });
  }
}
