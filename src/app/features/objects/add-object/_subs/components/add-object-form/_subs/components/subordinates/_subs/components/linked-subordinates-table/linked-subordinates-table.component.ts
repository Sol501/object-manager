import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Subordinate } from '../../../../../../../../../../../../core/subordinates/subordinate.models';
import { TableDirective } from '../../../../../../../../../../../../shared/ui/table/table.directive';
import { ObjectTypeLabelComponent } from '../../../../../../../../../../shared/object-type-label/object-type-label.component';

@Component( {
  selector: 'app-linked-subordinates-table',
  standalone: true,
  imports: [TableDirective, ObjectTypeLabelComponent],
  templateUrl: './linked-subordinates-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedSubordinatesTableComponent {
  readonly rows= input.required<readonly Subordinate[]>();
}
