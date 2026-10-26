import { AdvancedPreviewService } from '../../../../../../../../../advanced-preview.service';
import { AdvancedInputSettingsComponent } from './_subs/components/advanced-input-settings/advanced-input-settings.component';
import { TasksBoardComponent } from './_subs/components/tasks-board/tasks-board.component';
import { DynamicGridComponent } from './_subs/components/dynamic-grid/dynamic-grid.component';
import { ReferenceWidgetComponent } from './_subs/components/reference-widget/reference-widget.component';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlContainer, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  AttributeInput,
  AttributeInputOption,
} from '../../../../../../../../../../../../../../../../../../core/object-types/object-type.models';
import {
  AttributeInputForm,
  createInputOption,
  createInputTranslation,
  getAttributeInputs,
} from '../../../../../../../../../attribute-input-form.model';
import {
  AttributePreviewService,
  AttributePreviewValue,
} from '../../../../../../../../../attribute-preview.service';
import { InputSettingsComponent } from './_subs/components/input-settings/input-settings.component';

@Component({
  selector: 'app-attribute-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputSettingsComponent,
    ReferenceWidgetComponent,
    DynamicGridComponent,
    TasksBoardComponent,
    AdvancedInputSettingsComponent,
  ],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './attribute-input.component.html',
  styleUrl: './attribute-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeInputComponent implements OnInit {
  private readonly _container = inject(ControlContainer);
  private readonly _advancedPreviews = inject(AdvancedPreviewService);
  private readonly _previews = inject(AttributePreviewService);
  private readonly _destroy = inject(DestroyRef);
  private readonly _changeDetector = inject(ChangeDetectorRef);
  readonly removed = output<void>();
  readonly duplicated = output<void>();
  readonly moveStarted = output<PointerEvent>();
  readonly reordered = output<number>();
  readonly editing = signal(false);
  preview!: FormControl<AttributePreviewValue>;

  get group(): AttributeInputForm {
    return this._container.control as AttributeInputForm;
  }
  get definition(): AttributeInput {
    return this.group.getRawValue();
  }
  get label(): string {
    return this.definition.translations[0].label;
  }
  get controlId(): string {
    return `preview-${this.group.controls.id.value}`;
  }
  get canDuplicate(): boolean {
    return ['text', 'number', 'textarea', 'select', 'dynamic-grid'].includes(this.definition.kind);
  }
  get advanced(): boolean {
    return ['data-grid', 'dynamic-grid', 'gantt', 'tasks-board'].includes(
      this.group.controls.kind.value,
    );
  }
  constructor() {
    afterNextRender(() => {
      if (this._advancedPreviews.takeSettings(this.group)) this.editing.set(true);
    });
  }
  saveAdvanced(columns: string[] | null): void {
    if (columns) {
      this.group.controls.columns.setValue(columns);
      this.group.markAsDirty();
    }
    this.editing.set(false);
  }
  get fields() {
    return getAttributeInputs(this.group.root)
      .filter((input) => input !== this.group)
      .map((input) => ({
        id: input.controls.id.value,
        label: input.controls.translations.at(0).controls.label.value,
      }));
  }
  get files(): File[] {
    return this.definition.kind === 'file' ? (this.preview.value as File[]) : [];
  }

  ngOnInit(): void {
    this.preview = this._previews.controlFor(this.group);
    this.group.valueChanges.pipe(takeUntilDestroyed(this._destroy)).subscribe(() => {
      this.preview = this._previews.controlFor(this.group, true);
      this._changeDetector.markForCheck();
    });
  }

  optionLabel(option: AttributeInputOption): string {
    return this.definition.translations[0].language === 'Arabic'
      ? option.labelAr || option.labelEn
      : option.labelEn || option.labelAr;
  }

  checked(id: string): boolean {
    return Array.isArray(this.preview.value) && (this.preview.value as string[]).includes(id);
  }
  toggleOption(id: string): void {
    if (this.group.disabled) return;
    const selected = this.preview.value as string[];
    this.preview.setValue(
      this.checked(id) ? selected.filter((value) => value !== id) : [...selected, id],
    );
  }

  selectFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    this._addFiles(Array.from(input.files ?? []));
    input.value = '';
  }
  dragFiles(event: DragEvent): void {
    if (event.dataTransfer?.types.includes('Files')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  dropFiles(event: DragEvent): void {
    if (event.dataTransfer?.types.includes('Files')) {
      event.preventDefault();
      event.stopPropagation();
      this._addFiles(Array.from(event.dataTransfer.files));
    }
  }
  removeFile(index: number): void {
    if (this.group.disabled) return;
    this.preview.setValue(this.files.filter((file, position) => position !== index));
  }
  moveWithKeyboard(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.reordered.emit(event.key === 'ArrowUp' ? -1 : 1);
    }
  }
  save(value: AttributeInput): void {
    if (this.group.disabled) return;
    this.group.setControl(
      'translations',
      new FormArray(value.translations.map(createInputTranslation)),
      { emitEvent: false },
    );
    this.group.setControl('options', new FormArray(value.options.map(createInputOption)), {
      emitEvent: false,
    });
    this.group.patchValue(value, { emitEvent: false });
    this.group.updateValueAndValidity();
    this.group.markAsDirty();
    this.editing.set(false);
  }
  private _addFiles(files: File[]): void {
    if (this.group.disabled || !files.length) return;
    this.preview.setValue([...this.files, ...files]);
  }
}
