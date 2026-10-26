import {
   ChangeDetectionStrategy,
  Component,
  computed,
  input,
 OnInit,
  output,
  signal,
} from '@angular/core';
import { Subordinate } from '../../../../../../../../../../../../core/subordinates/subordinate.models';
import { DialogComponent } from '../../../../../../../../../../../../shared/ui/dialog/dialog.component';
import { TableSearchComponent } from '../../../../../../../../../../../../shared/ui/table-search/table-search.component';
import { ButtonDirective } from '../../../../../../../../../../../../shared/ui/button/button.directive';
import { SubordinateOptionsTableComponent } from './_subs/components/subordinate-options-table/subordinate-options-table.component';

@Component( {
  selector:'app-subordinate-picker',
  standalone: true,
  imports: [
    DialogComponent,
    ButtonDirective,
     TableSearchComponent,
    SubordinateOptionsTableComponent,
  ],
  templateUrl: './subordinate-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubordinatePickerComponent implements OnInit {
  readonly items = input.required<readonly Subordinate[]>();
  readonly selectedIds =input.required<readonly string[]>();
  readonly confirmed= output<string[]>();
  readonly cancelled = output<void>();
  readonly query = signal('');
  readonly selection = signal<ReadonlySet<string>>(new Set());
  readonly filteredItems = computed( () => {
    const query = this.query().trim().toLocaleLowerCase();
    return this.items().filter((item) =>
      `${item.id} ${item.name} ${item.type} ${item.state}`.toLocaleLowerCase().includes(query),
    );
  });

  ngOnInit(): void {
    this.selection.set(new Set(this.selectedIds()));
  }

  toggle(id: string): void {
    this.selection.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  confirm():void {
    this.confirmed.emit([...this.selection()]);
   }
}
