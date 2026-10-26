import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  output,
  signal,
} from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { AdvancedPreviewService } from '../../../../../../advanced-preview.service';
import { AttributeInputKind } from '../../../../../../../../../../../../../../../core/object-types/object-type.models';
import {
  createAttributeInput,
  clearInputReferences,
} from '../../../../../../attribute-input-form.model';
import { InputTypePickerComponent } from './_subs/components/input-type-picker/input-type-picker.component';
import { AttributeInputComponent } from './_subs/components/attribute-input/attribute-input.component';
import { AttributeCardForm } from '../../../../../../attributes-form.model';
import { CardSettingsComponent } from './_subs/components/card-settings/card-settings.component';

@Component({
  selector: 'app-attribute-card',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardSettingsComponent,
    InputTypePickerComponent,
    AttributeInputComponent,
  ],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  host: {
    '(document:pointerdown)': 'closeOutside($event)',
    '(keydown.escape)': 'menuOpen.set(false); cancelInputDrag()',
    '(document:pointermove)': 'moveInputPointer($event)',
    '(document:pointerup)': 'finishInputPointer($event)',
    '(document:pointercancel)': 'cancelInputDrag()',
  },
  templateUrl: './attribute-card.component.html',
  styleUrl: './attribute-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeCardComponent {
  private readonly _container = inject(ControlContainer);
  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _previews = inject(AdvancedPreviewService);
  readonly removed = output<void>();
  readonly moveStarted = output<PointerEvent>();
  readonly resizeStarted = output<PointerEvent>();
  readonly moveKey = output<KeyboardEvent>();
  readonly resizeKey = output<KeyboardEvent>();
  readonly menuOpen = signal(false);
  readonly editing = signal(false);
  readonly pickerOpen = signal(false);
  readonly draggingInputId = signal<string | null>(null);
  readonly inputDropTarget = signal<string | null>(null);
  private _inputPointerId: number | null = null;

  get inputs() {
    return this.group.controls.inputs;
  }
  openPicker(): void {
    this.menuOpen.set(false);
    if (!this.group.disabled) this.pickerOpen.set(true);
  }
  addInput(kind: AttributeInputKind): void {
    if (this.group.disabled) return;
    const input = createAttributeInput(kind);
    if (['data-grid', 'dynamic-grid', 'gantt', 'tasks-board'].includes(kind))
      this._previews.requestSettings(input);
    this.inputs.push(input);
    this.inputs.markAsDirty();
    this.pickerOpen.set(false);
  }
  removeInput(index: number): void {
    if (this.group.disabled) return;
    const id = this.inputs.at(index).controls.id.value;
    this.inputs.removeAt(index);
    clearInputReferences(this.group.root, [id]);
    this.inputs.markAsDirty();
  }
  duplicateInput(index: number): void {
    if (this.group.disabled) return;
    const value = this.inputs.at(index).getRawValue();
    const duplicate = createAttributeInput(value.kind, {
      ...value,
      id: crypto.randomUUID(),
      options: value.options.map((option) => ({ ...option, id: crypto.randomUUID() })),
    });
    if (value.kind === 'dynamic-grid')
      this._previews.duplicateTable(this.inputs.at(index), duplicate);
    this.inputs.insert(index + 1, duplicate);
    this.inputs.markAsDirty();
  }
  startInputDrag(index: number, event: PointerEvent): void {
    if (this.group.disabled || event.button !== 0) return;
    event.preventDefault();
    this._inputPointerId = event.pointerId;
    const id = this.inputs.at(index).controls.id.value;
    this.draggingInputId.set(id);
    this.inputDropTarget.set(id);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }
  moveInputPointer(event: PointerEvent): void {
    if (event.pointerId !== this._inputPointerId) return;
    if (this.group.disabled) {
      this.cancelInputDrag();
      return;
    }
    const host = this._element.nativeElement;
    const target = host.ownerDocument
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>('[data-input-id]');
    this.inputDropTarget.set(
      target && host.contains(target) ? (target.dataset['inputId'] ?? null) : null,
    );
    const body = host.querySelector<HTMLElement>('.card-body');
    if (body) {
      const rect = body.getBoundingClientRect();
      const rem = Number.parseFloat(
        host.ownerDocument.defaultView!.getComputedStyle(host.ownerDocument.documentElement)
          .fontSize,
      );
      if (event.clientY < rect.top + rem) body.scrollTop -= rem;
      else if (event.clientY > rect.bottom - rem) body.scrollTop += rem;
    }
  }
  finishInputPointer(event: PointerEvent): void {
    if (event.pointerId !== this._inputPointerId) return;
    const from = this.inputs.controls.findIndex(
      (input) => input.controls.id.value === this.draggingInputId(),
    );
    const to = this.inputs.controls.findIndex(
      (input) => input.controls.id.value === this.inputDropTarget(),
    );
    this.moveInput(from, to);
    this.cancelInputDrag();
  }
  cancelInputDrag(): void {
    this._inputPointerId = null;
    this.draggingInputId.set(null);
    this.inputDropTarget.set(null);
  }
  moveInput(from: number, to: number): void {
    if (this.group.disabled || from < 0 || to < 0 || to >= this.inputs.length || from === to)
      return;
    const input = this.inputs.at(from);
    this.inputs.removeAt(from, { emitEvent: false });
    this.inputs.insert(to, input);
    this.inputs.markAsDirty();
  }

  get group(): AttributeCardForm {
    return this._container.control as AttributeCardForm;
  }

  manage(): void {
    this.menuOpen.set(false);
    if (!this.group.disabled) this.editing.set(true);
  }

  save(value: { title: string; backgroundColor: string }): void {
    if (this.group.disabled) return;
    this.group.patchValue(value);
    this.group.markAsDirty();
    this.editing.set(false);
  }

  closeOutside(event: Event): void {
    if (!this._element.nativeElement.contains(event.target as Node)) this.menuOpen.set(false);
  }
}
