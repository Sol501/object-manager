import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Subordinate } from '../../../../../../../../../../../../../../../core/subordinates/subordinate.models';
import { TableDirective } from '../../../../../../../../../../../../../../../shared/ui/table/table.directive';
import { ToggleSwitchComponent } from '../../../../../../../../../../../../../../../shared/ui/toggle-switch/toggle-switch.component';
import { ObjectTypeLabelComponent } from '../../../../../../../../../../../../../shared/object-type-label/object-type-label.component';

@Component({
  selector: 'app-subordinate-options-table',
  standalone: true,
  imports:  [TableDirective, ToggleSwitchComponent, ObjectTypeLabelComponent],
  templateUrl: './subordinate-options-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubordinateOptionsTableComponent {
  readonly rows = input.required<readonly Subordinate[]>();
  readonly selectedIds = input.required<ReadonlySet<string>>();
  readonly toggled = output<string>();
}
