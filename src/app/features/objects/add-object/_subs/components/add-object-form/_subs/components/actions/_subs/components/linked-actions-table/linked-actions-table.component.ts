import { ChangeDetectionStrategy,Component, input, output } from '@angular/core';
import { ObjectAction } from '../../../../../../../../../../../../core/object-actions/object-action.models';
import { TableDirective } from '../../../../../../../../../../../../shared/ui/table/table.directive';
import { RowActionsMenuComponent } from '../../../../../../../../../../../../shared/ui/row-actions-menu/row-actions-menu.component';

@Component({
  selector: 'app-linked-actions-table',
  standalone: true,
  imports: [TableDirective, RowActionsMenuComponent],
  templateUrl: './linked-actions-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedActionsTableComponent {
  readonly rows = input.required<readonly ObjectAction[]>();
 readonly busy = input(false);
  readonly removed = output<string>();
}
