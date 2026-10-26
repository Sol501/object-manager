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
import { ObjectAction } from '../../../../../../../../../core/object-actions/object-action.models';
import { ButtonDirective } from '../../../../../../../../../shared/ui/button/button.directive';
import { ActionsFacade } from './_subs/services/actions.facade.service';
import { LinkedActionsTableComponent } from './_subs/components/linked-actions-table/linked-actions-table.component';
import { ActionPickerComponent } from './_subs/components/action-picker/action-picker.component';

@Component({
  selector: 'app-actions-step',
  standalone: true,
  imports: [ButtonDirective, LinkedActionsTableComponent, ActionPickerComponent],
  providers: [ActionsFacade],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
 ],
  templateUrl: './actions-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsStepComponent implements OnInit {
  private readonly _container = inject(ControlContainer);
  private readonly _injector = inject(Injector);
  private readonly _linkButton = viewChild<ElementRef<HTMLButtonElement>>('linkButton');
  readonly facade = inject(ActionsFacade);
  readonly active = input(false);
  readonly busy = input(false);
  readonly pickerOpen = signal(false);
  selectedRows!: Signal<ObjectAction[]>;

  get group(): FormGroup<{ selectedIds:  FormControl<string[]> }> {
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
      selection.some( (id) => !control.value.includes(id))
    ) {
      control.setValue(selection);
      control.markAsDirty();
    }
    control.markAsTouched();
	  this.pickerOpen.set(false);
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
