import { ChangeDetectionStrategy,Component, input, output } from '@angular/core';
import { Kpi } from '../../../../../../../../../../../../../../../core/kpis/kpi.models';
import { TableDirective } from '../../../../../../../../../../../../../../../shared/ui/table/table.directive';
import { ToggleSwitchComponent } from '../../../../../../../../../../../../../../../shared/ui/toggle-switch/toggle-switch.component';

@Component({
  selector: 'app-kpi-options-table',
  standalone: true,
  imports: [TableDirective, ToggleSwitchComponent],
  templateUrl: './kpi-options-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiOptionsTableComponent {
  readonly rows = input.required<readonly Kpi[]>();
  readonly selectedIds = input.required<ReadonlySet<string>>();
  readonly toggled = output<string>();
}
