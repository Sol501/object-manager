import {
  ChangeDetectionStrategy,
  Component,
	computed,
  input,
   OnInit,
  output,
	signal,
} from '@angular/core';
import { ObjectAction } from '../../../../../../../../../../../../core/object-actions/object-action.models';
import { DialogComponent } from '../../../../../../../../../../../../shared/ui/dialog/dialog.component';
import { TableSearchComponent } from '../../../../../../../../../../../../shared/ui/table-search/table-search.component';
import { TableDirective } from '../../../../../../../../../../../../shared/ui/table/table.directive';
import { ToggleSwitchComponent } from '../../../../../../../../../../../../shared/ui/toggle-switch/toggle-switch.component';
import { ButtonDirective } from '../../../../../../../../../../../../shared/ui/button/button.directive';

@Component({
  selector: 'app-action-picker',
  standalone:true,
  imports: [
	  DialogComponent,
    ButtonDirective,
    TableSearchComponent,
    TableDirective,
    ToggleSwitchComponent,
  ],
  templateUrl:  './action-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionPickerComponent implements OnInit {
  readonly items = input.required<readonly ObjectAction[]>();
  readonly selectedIds = input.required<readonly string[]>();
  readonly confirmed = output<string[]>();
  readonly cancelled  = output<void>();
  readonly query = signal('');
  readonly selection = signal<ReadonlySet<string>>(new Set());
  readonly filteredItems = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    return this.items().filter((item) =>
       `${item.id} ${item.name}`.toLocaleLowerCase().includes(query),
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

  confirm(): void {
    this.confirmed.emit([...this.selection()]);
  }
}
