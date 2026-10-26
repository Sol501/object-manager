import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Kpi } from '../../../../../../../../../../../../core/kpis/kpi.models';
import { TableDirective } from '../../../../../../../../../../../../shared/ui/table/table.directive';
import { RowActionsMenuComponent } from '../../../../../../../../../../../../shared/ui/row-actions-menu/row-actions-menu.component';

@Component({
  selector: 'app-linked-kpis-table',
  standalone: true,
  imports: [TableDirective, RowActionsMenuComponent],
  templateUrl: './linked-kpis-table.component.html',
  changeDetection:  ChangeDetectionStrategy.OnPush,
})
export class LinkedKpisTableComponent {
  readonly rows = input.required<readonly Kpi[]>();
  readonly busy = input(false);
  readonly removed = output<string>();
}
