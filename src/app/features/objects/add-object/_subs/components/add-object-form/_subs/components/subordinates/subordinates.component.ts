import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
 input,
  OnInit,
  Signal,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { Subordinate } from '../../../../../../../../../core/subordinates/subordinate.models';
import { ButtonDirective } from '../../../../../../../../../shared/ui/button/button.directive';
import { SubordinatesFacade } from './_subs/services/subordinates.facade.service';
import { LinkedSubordinatesTableComponent } from './_subs/components/linked-subordinates-table/linked-subordinates-table.component';
import { SubordinatePickerComponent } from './_subs/components/subordinate-picker/subordinate-picker.component';

@Component({
  selector: 'app-subordinates',
  standalone: true,
  imports: [ButtonDirective, LinkedSubordinatesTableComponent, SubordinatePickerComponent],
 providers: [SubordinatesFacade],
  viewProviders: [
    { provide: ControlContainer, useFactory:  () => inject(ControlContainer, { skipSelf: true }) },
	],
 templateUrl: './subordinates.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class SubordinatesComponent implements OnInit {
  private readonly _container = inject(ControlContainer);
  private readonly _injector = inject(Injector);
  readonly facade = inject(SubordinatesFacade);
  readonly active = input(false);
  readonly busy = input(false);
   readonly pickerOpen = signal(false);
  selectedRows!: Signal<Subordinate[]>;

  get group(): FormGroup<{ selectedIds: FormControl<string[]> }> {
    return this._container.control as FormGroup<{ selectedIds: FormControl<string[]> }>;
   }

  constructor() {
    effect(() => {
      if (this.active()) {
        untracked(() => this.facade.ensureLoaded());
      } else {
        this.pickerOpen.set(false);
      }
    });
  }

  ngOnInit(): void {
    const control = this.group.controls.selectedIds;
    const ids = toSignal(control.valueChanges, {
     initialValue: control.value,
     injector: this._injector,
    });
    this.selectedRows = computed(() =>
      this.facade.items().filter((item) => ids().includes(item.id)),
    );
   }

  confirmSelection(ids: string[]): void {
    if (this.busy()) {
      return;
    }
    const control = this.group.controls.selectedIds;
    const selection = [...new Set(ids)];
    if (
      selection.length !== control.value.length ||
      selection.some((id) => !control.value.includes(id))
    ) {
      control.setValue(selection);
      control.markAsDirty();
    }
    control.markAsTouched();
    this.pickerOpen.set(false);
  }
}
