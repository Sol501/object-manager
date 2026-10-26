import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
 input,
  OnInit,
  Signal,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { Kpi } from '../../../../../../../../../core/kpis/kpi.models';
import { ButtonDirective } from '../../../../../../../../../shared/ui/button/button.directive';
import { LinkedKpisFacade } from './_subs/services/linked-kpis.facade.service';
import { LinkedKpisTableComponent } from './_subs/components/linked-kpis-table/linked-kpis-table.component';
import { KpiPickerComponent } from './_subs/components/kpi-picker/kpi-picker.component';

@Component({
  selector: 'app-linked-kpis',
  standalone: true,
  imports: [ButtonDirective, LinkedKpisTableComponent, KpiPickerComponent],
  providers: [LinkedKpisFacade],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './linked-kpis.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedKpisComponent implements OnInit {
  private readonly _container = inject(ControlContainer);
  private readonly _injector = inject(Injector);
  private readonly _linkButton = viewChild<ElementRef<HTMLButtonElement>>('linkButton');
  readonly facade = inject(LinkedKpisFacade);
  readonly active = input(false);
  readonly busy = input(false);
  readonly pickerOpen = signal(false);
 selectedRows!: Signal<Kpi[]>;

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
    const selection =[...new Set(ids)];
    if (
      selection.length !== control.value.length ||
      selection.some((id) => !control.value.includes(id))
   ) {
      control.setValue(selection);
      control.markAsDirty();
    }
    control.markAsTouched();
    this.pickerOpen.set( false);
   }

  removeSelection(id: string): void {
    if (this.busy()) {
      return;
    }
    this.confirmSelection(
      this.group.controls.selectedIds.value.filter((selectedId) => selectedId !== id),
    );
    afterNextRender(() => this._linkButton()?.nativeElement.focus(), { injector: this._injector });
  }
}
