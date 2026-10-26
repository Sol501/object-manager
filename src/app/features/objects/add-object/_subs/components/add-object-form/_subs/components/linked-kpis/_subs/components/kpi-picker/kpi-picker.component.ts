import {
  ChangeDetectionStrategy,
  Component,
 computed,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Kpi } from '../../../../../../../../../../../../core/kpis/kpi.models';
import { DialogComponent } from '../../../../../../../../../../../../shared/ui/dialog/dialog.component';
import { TableSearchComponent } from '../../../../../../../../../../../../shared/ui/table-search/table-search.component';
import { ButtonDirective } from '../../../../../../../../../../../../shared/ui/button/button.directive';
import { KpiOptionsTableComponent } from './_subs/components/kpi-options-table/kpi-options-table.component';

@Component({
  selector:'app-kpi-picker',
  standalone: true,
  imports: [DialogComponent, ButtonDirective, TableSearchComponent, KpiOptionsTableComponent],
 templateUrl: './kpi-picker.component.html',
  changeDetection:  ChangeDetectionStrategy.OnPush,
})
export class KpiPickerComponent implements OnInit {
  readonly items = input.required<readonly Kpi[]>();
  readonly selectedIds = input.required<readonly string[]>();
  readonly confirmed =  output<string[]>();
  readonly cancelled = output<void>();
   readonly query = signal('');
  readonly selection = signal<ReadonlySet<string>>(new Set());
  readonly filteredItems = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    return this.items().filter((item) =>
      `${item.id} ${item.name} ${item.source} ${item.state}`.toLocaleLowerCase().includes(query),
	  );
  });

  ngOnInit(): void {
    this.selection.set(new Set(this.selectedIds()));
  }

  toggle(id: string): void {
    this.selection.update((current) => {
      const next= new Set(current);
      if (next.has(id)) {
         next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  confirm(): void {
    this.confirmed.emit( [...this.selection()]);
  }
}
